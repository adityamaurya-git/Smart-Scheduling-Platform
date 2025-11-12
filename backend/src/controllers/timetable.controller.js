const Section = require('../models/section.model');
const Faculty = require('../models/faculty.model');
const Room = require('../models/room.model');
const Timetable = require('../models/timetable.model')

// Add this helper function at the top of the file
function timeToMinutes(timeStr) { // e.g., "09:50"
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

function parseTimeSlot(slot) {
    const [start, end] = slot.split('-');
    return { start, end };
}

function isFacultyAvailableForSlot(fac, day, slot) {
    if (!fac.availability || fac.availability.length === 0) return true; // if no constraints, assume available
    const avail = fac.availability.find(a => a.day === day);
    if (!avail) return false;
    const { start, end } = parseTimeSlot(slot);
    const cs = timeToMinutes(start);
    const ce = timeToMinutes(end);
    const fs = timeToMinutes(avail.startTime);
    const fe = timeToMinutes(avail.endTime);
    return cs >= fs && ce <= fe;
}

function canFacultyTeach(fac, subjectId) {
    return Array.isArray(fac.specializedSubjects) && fac.specializedSubjects.some(s => s._id.equals(subjectId));
}

function getRequiredRoomType(subject) {
    // Priority-based mapping: Lab > Library > CRT(Seminar Hall)
    if (subject.isLab) return 'Lab';
    const name = (subject.subjectName || '').toLowerCase();
    if (name.includes('library')) return 'Library';
    if (name.includes('crt')) return 'Seminar Hall';
    return null; // no strict requirement
}

function isRoomSuitable(room, subject) {
    if (!room) return false;
    if (room.capacity < subject.requiredBatchSize) return false;
    const requiredType = getRequiredRoomType(subject);
    if (requiredType) return room.roomType === requiredType;
    // No strict requirement: allow any room type (keeps flexibility and density)
    return true;
}

async function buildTimetablesBySlots({ sections, allFaculties, allRooms, timeSlots, days }) {
    // Per-section remaining subject hours
    const remainingBySection = new Map();
    const totalRemainingBySection = new Map();
    sections.forEach(sec => {
        const rem = new Map();
        let total = 0;
        (sec.subjects || []).forEach(sub => {
            rem.set(String(sub._id), sub.weeklyHours || 0);
            total += (sub.weeklyHours || 0);
        });
        remainingBySection.set(String(sec._id), rem);
        totalRemainingBySection.set(String(sec._id), total);
    });

    // Faculty remaining load
    const facultyLoadRemaining = {};
    allFaculties.forEach(f => { facultyLoadRemaining[String(f._id)] = f.teachingLoad || 0; });

    // Build empty schedule classes array per section
    const timetableBySection = new Map();
    sections.forEach(sec => timetableBySection.set(String(sec._id), []));

    // --- Fixed General Classroom per section for theory subjects ---
    const fixedGeneralRoomBySection = new Map(); // sectionId -> roomId (General Classroom) or null
    const assignedGeneralRooms = new Set();
    const generalRooms = allRooms.filter(r => r.roomType === 'General Classroom');
    const shuffledGeneralRooms = generalRooms.slice().sort(() => Math.random() - 0.5);
    function isTheory(sub) {
        const req = getRequiredRoomType(sub);
        return !sub.isLab && !req;
    }
    for (const sec of sections) {
        const secId = String(sec._id);
        // Determine needed capacity for theory subjects (max requiredBatchSize among theory)
        let needed = 0;
        (sec.subjects || []).forEach(sub => {
            if (isTheory(sub)) needed = Math.max(needed, sub.requiredBatchSize || 0);
        });
        if (needed === 0) { fixedGeneralRoomBySection.set(secId, null); continue; }
        const candidate = shuffledGeneralRooms.find(r => r.capacity >= needed && !assignedGeneralRooms.has(String(r._id)));
        if (candidate) {
            fixedGeneralRoomBySection.set(secId, String(candidate._id));
            assignedGeneralRooms.add(String(candidate._id));
        } else {
            fixedGeneralRoomBySection.set(secId, null); // fallback: no fixed GC available
        }
    }

    // Helper to generate candidates for a section at a slot
    function candidatesFor(sec, day, slot) {
        const remMap = remainingBySection.get(String(sec._id));
        let remTotal = totalRemainingBySection.get(String(sec._id)) || 0;
        const candidates = [];
        if (!remMap || remTotal <= 0) {
            // No class needed for this slot
            candidates.push(null);
            return candidates;
        }
        // Iterate subjects with remaining hours (prioritize those with more remaining; add randomness to avoid bias)
        const subs = (sec.subjects || []).slice().sort((a, b) => {
            const la = remMap.get(String(a._id)) || 0;
            const lb = remMap.get(String(b._id)) || 0;
            if (lb !== la) return lb - la; // more remaining first
            return Math.random() - 0.5; // tie-break randomly to diversify
        });
        for (const sub of subs) {
            const left = remMap.get(String(sub._id)) || 0;
            if (left <= 0) continue;
            // Faculties qualified and available (randomized order to prevent the same first-choice always winning)
            const facPool = allFaculties.slice().sort(() => Math.random() - 0.5);
            for (const fac of facPool) {
                const fid = String(fac._id);
                if (facultyLoadRemaining[fid] <= 0) continue;
                if (!canFacultyTeach(fac, sub._id)) continue;
                if (!isFacultyAvailableForSlot(fac, day, slot)) continue;
                // Rooms: use fixed GC for theory if available; else special types or preference order
                let roomPool;
                const requiredType = getRequiredRoomType(sub);
                if (requiredType) {
                    roomPool = allRooms.filter(r => r.roomType === requiredType).sort(() => Math.random() - 0.5);
                } else {
                    const fixedGC = fixedGeneralRoomBySection.get(String(sec._id));
                    if (fixedGC) {
                        roomPool = allRooms.filter(r => String(r._id) === fixedGC);
                    } else {
                        const gc = allRooms.filter(r => r.roomType === 'General Classroom').sort(() => Math.random() - 0.5);
                        const others = allRooms.filter(r => r.roomType !== 'General Classroom').sort(() => Math.random() - 0.5);
                        roomPool = [...gc, ...others];
                    }
                }
                for (const room of roomPool) {
                    if (!isRoomSuitable(room, sub)) continue;
                    candidates.push({ subjectId: String(sub._id), facultyId: fid, roomId: String(room._id) });
                }
            }
        }
        // Allow skip even if we have remaining to enable breaks/backtracking
        candidates.push(null);
        return candidates;
    }

    // Track which faculties were assigned in each prior slot to enforce max 2 consecutive rule
    const assignedFacultyByDaySlot = new Map(); // key: `${day}:${slotIndex}` -> Set(facultyId)
    // Track per-day load per faculty (daily cap)
    const facultyDailyCount = new Map(); // key: `${day}:${facultyId}` -> count
    // Track per-section/day subject usage to avoid > 2 per day
    const sectionDaySubjectCount = new Map(); // key: `${sectionId}:${day}:${subjectId}` -> count
    // Quick lookup of what was assigned for a section at a particular day/slot
    const sectionScheduleByDaySlot = new Map(); // key: `${sectionId}` -> Map(`${day}:${slotIndex}` -> cls)
    sections.forEach(sec => sectionScheduleByDaySlot.set(String(sec._id), new Map()));

    // Backtracking assignment per slot across sections ensuring unique faculty/room
    function assignSlot(day, slot) {
        const slotIndex = timeSlots.indexOf(slot);
        const usedFaculty = new Set();
        const usedRoom = new Set();
        // Build candidate lists per section
        const items = sections.map(sec => ({ sec, cands: candidatesFor(sec, day, slot) }));
        // Sort by ascending candidates (most constrained first)
        items.sort((a, b) => a.cands.length - b.cands.length);

        function tryAssign(idx) {
            if (idx >= items.length) return true;
            const { sec, cands } = items[idx];
            for (const cand of cands) {
                if (cand) {
                    const kf = `${cand.facultyId}-${day}-${slot}`;
                    const kr = `${cand.roomId}-${day}-${slot}`;
                    if (usedFaculty.has(kf) || usedRoom.has(kr)) continue;

                    // Enforce: A faculty should not be assigned for more than two continuous timeslots (no 3 in a row)
                    if (slotIndex >= 2) {
                        const prev1 = assignedFacultyByDaySlot.get(`${day}:${slotIndex - 1}`);
                        const prev2 = assignedFacultyByDaySlot.get(`${day}:${slotIndex - 2}`);
                        if (prev1 && prev2 && prev1.has(cand.facultyId) && prev2.has(cand.facultyId)) {
                            continue; // would create a 3rd consecutive slot for this faculty
                        }
                    }

                    // Enforce: Faculty daily cap (max 4 periods/day across all sections)
                    const fDayKey = `${day}:${cand.facultyId}`;
                    const fDayCount = facultyDailyCount.get(fDayKey) || 0;
                    if (fDayCount >= 4) continue;

                    // Enforce: Per-section/day subject max 3
                    const secId = String(sec._id);
                    const sDayKey = `${secId}:${day}:${cand.subjectId}`;
                    const sDayCount = sectionDaySubjectCount.get(sDayKey) || 0;
                    if (sDayCount >= 3) continue;

                    // Enforce: If previous slot has the same subject for this section, keep faculty and room the same
                    if (slotIndex > 0) {
                        const scheduleMap = sectionScheduleByDaySlot.get(secId);
                        const prevCls = scheduleMap.get(`${day}:${slotIndex - 1}`);
                        if (prevCls && String(prevCls.subject) === String(cand.subjectId)) {
                            if (String(prevCls.faculty) !== String(cand.facultyId) || String(prevCls.room) !== String(cand.roomId)) {
                                continue; // must keep same faculty and room when extending the same subject consecutively
                            }
                        }
                    }
                    // Tentatively assign
                    usedFaculty.add(kf);
                    usedRoom.add(kr);
                    // mutate state
                    const remMap = remainingBySection.get(String(sec._id));
                    const sid = cand.subjectId;
                    remMap.set(sid, (remMap.get(sid) || 0) - 1);
                    totalRemainingBySection.set(String(sec._id), (totalRemainingBySection.get(String(sec._id)) || 0) - 1);
                    facultyLoadRemaining[cand.facultyId] = (facultyLoadRemaining[cand.facultyId] || 0) - 1;
                    const cls = { subject: cand.subjectId, faculty: cand.facultyId, room: cand.roomId, day, timeSlot: slot };
                    timetableBySection.get(String(sec._id)).push(cls);
                    // update daily counters and section schedule map
                    facultyDailyCount.set(fDayKey, fDayCount + 1);
                    sectionDaySubjectCount.set(sDayKey, sDayCount + 1);
                    sectionScheduleByDaySlot.get(secId).set(`${day}:${slotIndex}`, cls);

                    if (tryAssign(idx + 1)) return true;

                    // backtrack
                    timetableBySection.get(String(sec._id)).pop();
                    facultyLoadRemaining[cand.facultyId] += 1;
                    remMap.set(sid, (remMap.get(sid) || 0) + 1);
                    totalRemainingBySection.set(String(sec._id), (totalRemainingBySection.get(String(sec._id)) || 0) + 1);
                    usedFaculty.delete(kf);
                    usedRoom.delete(kr);
                    // revert daily counters and schedule map
                    facultyDailyCount.set(fDayKey, fDayCount);
                    sectionDaySubjectCount.set(sDayKey, sDayCount);
                    sectionScheduleByDaySlot.get(secId).delete(`${day}:${slotIndex}`);
                } else {
                    // Skip assignment for this section in this slot
                    if (tryAssign(idx + 1)) return true;
                }
            }
            return false;
        }

        // We do not require that every section gets a class in every slot; failure just means we leave some unassigned
        tryAssign(0);

        // Finalize: record which faculties were assigned in this slot to support consecutive constraint for next slots
        const assignedSet = new Set();
        for (const sec of sections) {
            const secId = String(sec._id);
            const scheduleMap = sectionScheduleByDaySlot.get(secId);
            const cls = scheduleMap.get(`${day}:${slotIndex}`);
            if (cls) assignedSet.add(String(cls.faculty));
        }
        assignedFacultyByDaySlot.set(`${day}:${slotIndex}`, assignedSet);
    }

    // Second-pass rebalancer: try to fill empty slots without violating constraints
    function fillEmptySlotsAfterFirstPass() {
        for (const day of days) {
            for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
                const slot = timeSlots[slotIndex];

                // Determine which faculties/rooms are already used in this slot across all sections
                const usedFacultyIds = new Set();
                const usedRoomIds = new Set();
                for (const sec of sections) {
                    const secId = String(sec._id);
                    const scheduleMap = sectionScheduleByDaySlot.get(secId);
                    const cls = scheduleMap.get(`${day}:${slotIndex}`);
                    if (cls) {
                        usedFacultyIds.add(String(cls.faculty));
                        usedRoomIds.add(String(cls.room));
                    }
                }

                for (const sec of sections) {
                    const secId = String(sec._id);
                    const scheduleMap = sectionScheduleByDaySlot.get(secId);
                    // Skip if already assigned at this slot
                    if (scheduleMap.get(`${day}:${slotIndex}`)) continue;

                    // Only try if the section still has remaining hours overall
                    if ((totalRemainingBySection.get(secId) || 0) <= 0) continue;

                    const remMap = remainingBySection.get(secId);
                    if (!remMap) continue;

                    // Build subject order: more remaining first, random tie-break
                    const subjectsOrdered = (sec.subjects || []).slice().sort((a, b) => {
                        const la = remMap.get(String(a._id)) || 0;
                        const lb = remMap.get(String(b._id)) || 0;
                        if (lb !== la) return lb - la;
                        return Math.random() - 0.5;
                    });

                    let placed = false;
                    for (const sub of subjectsOrdered) {
                        const sid = String(sub._id);
                        if ((remMap.get(sid) || 0) <= 0) continue;

                        // Enforce per-section/day subject cap 3
                        const sDayKey = `${secId}:${day}:${sid}`;
                        const sDayCount = sectionDaySubjectCount.get(sDayKey) || 0;
                        if (sDayCount >= 3) continue;

                        const prevCls = scheduleMap.get(`${day}:${slotIndex - 1}`);
                        const continuityRequired = slotIndex > 0 && prevCls && String(prevCls.subject) === sid;

                        // Faculty order randomized
                        const facPool = allFaculties.slice().sort(() => Math.random() - 0.5);
                        for (const fac of facPool) {
                            const fid = String(fac._id);
                            if (facultyLoadRemaining[fid] <= 0) continue;
                            if (!canFacultyTeach(fac, sub._id)) continue;
                            if (!isFacultyAvailableForSlot(fac, day, timeSlots[slotIndex])) continue;

                            // Enforce consecutive rule: don't make it 3 in a row
                            if (slotIndex >= 2) {
                                const prev1 = assignedFacultyByDaySlot.get(`${day}:${slotIndex - 1}`);
                                const prev2 = assignedFacultyByDaySlot.get(`${day}:${slotIndex - 2}`);
                                if (prev1 && prev2 && prev1.has(fid) && prev2.has(fid)) {
                                    continue;
                                }
                            }

                            // Daily cap 4
                            const fDayKey = `${day}:${fid}`;
                            const fDayCount = facultyDailyCount.get(fDayKey) || 0;
                            if (fDayCount >= 4) continue;

                            // Continuity: if same subject as previous slot, force same faculty
                            if (continuityRequired && String(prevCls.faculty) !== fid) continue;

                            // Rooms: use fixed GC for theory if available; else special types or preference order
                            let roomPool;
                            const requiredType = getRequiredRoomType(sub);
                            if (requiredType) {
                                roomPool = allRooms.filter(r => r.roomType === requiredType).sort(() => Math.random() - 0.5);
                            } else {
                                const fixedGC = fixedGeneralRoomBySection.get(secId);
                                if (fixedGC) {
                                    roomPool = allRooms.filter(r => String(r._id) === fixedGC);
                                } else {
                                    const gc = allRooms.filter(r => r.roomType === 'General Classroom').sort(() => Math.random() - 0.5);
                                    const others = allRooms.filter(r => r.roomType !== 'General Classroom').sort(() => Math.random() - 0.5);
                                    roomPool = [...gc, ...others];
                                }
                            }
                            for (const room of roomPool) {
                                const rid = String(room._id);
                                if (!isRoomSuitable(room, sub)) continue;

                                // Continuity: if same subject continues, force same room
                                if (continuityRequired && String(prevCls.room) !== rid) continue;

                                // Unique in this slot across sections
                                if (usedFacultyIds.has(fid) || usedRoomIds.has(rid)) continue;

                                // Assign
                                const cls = { subject: sid, faculty: fid, room: rid, day, timeSlot: timeSlots[slotIndex] };
                                timetableBySection.get(secId).push(cls);
                                scheduleMap.set(`${day}:${slotIndex}`, cls);
                                // Update counters
                                remMap.set(sid, (remMap.get(sid) || 0) - 1);
                                totalRemainingBySection.set(secId, (totalRemainingBySection.get(secId) || 0) - 1);
                                facultyLoadRemaining[fid] = (facultyLoadRemaining[fid] || 0) - 1;
                                sectionDaySubjectCount.set(sDayKey, sDayCount + 1);
                                facultyDailyCount.set(fDayKey, fDayCount + 1);
                                // Update per-slot tracking
                                let set = assignedFacultyByDaySlot.get(`${day}:${slotIndex}`);
                                if (!set) { set = new Set(); assignedFacultyByDaySlot.set(`${day}:${slotIndex}`, set); }
                                set.add(fid);
                                usedFacultyIds.add(fid);
                                usedRoomIds.add(rid);
                                placed = true;
                                break;
                            }
                            if (placed) break;
                        }
                        if (placed) break;
                    }
                }
            }
        }
    }

    // Iterate over week slots
    for (const day of days) {
        for (const slot of timeSlots) {
            assignSlot(day, slot);
        }
    }

    // Second pass to reduce empty slots
    fillEmptySlotsAfterFirstPass();

    // Build results compatible with existing formatter
    const results = {};
    sections.forEach(sec => {
        const classes = timetableBySection.get(String(sec._id));
        results[sec.name] = [{ classes, fitness: 0 }];
    });
    return results;
}

async function generateTimetableFor(req, res) {
    try {
        const { departmentId, year } = req.body;
        if (!departmentId || !year) {
            return res.status(400).json({ message: "Department and year are required." });
        }

        const sections = await Section.find({ admin:req.admin._id , department: departmentId, year: year }).populate('subjects');
        if (sections.length === 0) {
            return res.status(404).json({ message: "No sections found for the given department and year." });
        }

        const allFaculties = await Faculty.find({admin:req.admin._id , department: departmentId }).populate('specializedSubjects');
        const allRooms = await Room.find({admin:req.admin._id});

        const timeSlots = ["09:00-09:50", "09:50-10:40", "10:40-11:30", "11:30-12:20", "13:00-13:50", "13:50-14:40", "14:40-15:30"];

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        // Build all section timetables slot-by-slot across the week with unique faculty/rooms per slot
        const results = await buildTimetablesBySlots({ sections, allFaculties, allRooms, timeSlots, days });

       

const formattedResults = {};
for (const sectionName in results) {
    // Find the original section object to get access to its subjects
    const section = sections.find(s => s.name === sectionName);
    if (!section) continue; // Should not happen

    formattedResults[sectionName] = results[sectionName].map((timetable) => {
        const scheduleByDay = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [] };

        // Populate display data but PRESERVE IDs for saving later
        const populatedClasses = timetable.classes.map(cls => {
            const subject = section.subjects.find(s => s._id.equals(cls.subject));
            const faculty = allFaculties.find(f => f._id.equals(cls.faculty));
            const room = allRooms.find(r => r._id.equals(cls.room));

            return {
                ...cls, // Keep ids, day, timeSlot, etc.
                subject: subject ? { _id: subject._id, subjectName: subject.subjectName } : cls.subject,
                faculty: faculty ? { _id: faculty._id, facultyName: faculty.facultyName } : cls.faculty,
                room: room ? { _id: room._id, roomNumber: room.roomNumber } : cls.room
            };
        });

        // Group by day
        populatedClasses.forEach(cls => {
            if (scheduleByDay[cls.day]) {
                scheduleByDay[cls.day].push(cls);
            }
        });

        // Sort each day by timeSlot
        for (const day in scheduleByDay) {
            scheduleByDay[day].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
        }

        return {
            fitness: timetable.fitness,
            schedule: scheduleByDay,
            // Include raw classes with ObjectIds for reliable saving
            rawClasses: timetable.classes
        };
    });
}

        res.status(200).json({
            message: "Timetable generation process completed successfully.",
            generatedTimetables: formattedResults,
        });

    } catch (error) {
        console.error('Timetable generation failed:', error);
        res.status(500).json({ message: "An error occurred during timetable generation." });
    }
};


// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************


const createTimetable = async (req, res) => {
    try {
        const newTimetable = new Timetable({
            name: req.body.name,
            score: req.body.score,
            classes: req.body.classes,
            admin:req.admin._id
        });
        const savedTimetable = await newTimetable.save();
        res.status(201).json(savedTimetable);
    } catch (error) {
        console.error("Error saving timetable:", error);
        res.status(400).json({ message: "Failed to create timetable", error: error.message });
    }
};

const getAlltimetable = async (req, res) => {
    try {
        // --- FIX: Added .populate() to show names/numbers instead of IDs ---
        const timetables = await Timetable.find({ admin: req.admin._id })
            .populate('classes.subject', 'subjectName subjectCode')
            .populate('classes.faculty', 'facultyName')
            .populate('classes.room', 'roomNumber')
            .sort({ generatedAt: -1 }); // Sort by newest first

        res.status(200).json(timetables);
    } catch (error) {
        console.error("Error fetching all timetables:", error);
        res.status(500).json({ message: "Error fetching timetables." });
    }
}

const getTimetableById = async (req, res) => {
    try {
        const timetable = await Timetable.findOne({ _id: req.params.id, admin: req.admin._id })
            .populate('classes.subject', 'subjectName subjectCode')
            .populate('classes.faculty', 'facultyName')
            .populate('classes.room', 'roomNumber');

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        // You might want to format the flat 'classes' array into a grouped 'schedule' object
        // here as well, so your TimetableGrid component can be reused easily.
        const scheduleByDay = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [] };
        timetable.classes.forEach(cls => {
            if (!scheduleByDay[cls.day]) return;
            // Normalize for UI: provide generic 'name' for faculty/room to match frontend display helper
            const normalized = {
                ...cls.toObject?.() || cls,
                subject: cls.subject ? { subjectName: cls.subject.subjectName, subjectCode: cls.subject.subjectCode } : cls.subject,
                faculty: cls.faculty ? { name: cls.faculty.facultyName } : cls.faculty,
                room: cls.room ? { name: cls.room.roomNumber } : cls.room,
            };
            scheduleByDay[cls.day].push(normalized);
        });
        for (const day in scheduleByDay) {
            scheduleByDay[day].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
        }

        res.status(200).json({
            _id: timetable._id,
            name: timetable.name,
            score: timetable.score,
            generatedAt: timetable.generatedAt,
            schedule: scheduleByDay // Send the formatted schedule
        });

    } catch (error) {
        console.error("Error fetching timetable:", error);
        res.status(500).json({ message: "Failed to fetch timetable", error: error.message });
    }
};


module.exports = {
    createTimetable,
    generateTimetableFor,
    getAlltimetable,
    getTimetableById
};