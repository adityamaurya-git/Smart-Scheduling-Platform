const Section = require('../models/section.model');
const Faculty = require('../models/faculty.model');
const Room = require('../models/room.model');
const Timetable = require('../models/timetable.model')

// Add this helper function at the top of the file
function timeToMinutes(timeStr) { // e.g., "09:50"
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

async function generateTimetableFor(req, res) {
    try {
        const { departmentId, year } = req.body;
        if (!departmentId || !year) {
            return res.status(400).json({ message: "Department and year are required." });
        }

        const sections = await Section.find({ department: departmentId, year: year }).populate('subjects');
        if (sections.length === 0) {
            return res.status(404).json({ message: "No sections found for the given department and year." });
        }

        const allFaculties = await Faculty.find({ department: departmentId }).populate('specializedSubjects');
        const allRooms = await Room.find();

        const timeSlots = ["09:00-09:50", "09:50-10:40", "10:40-11:30", "11:30-12:20", "13:00-13:50", "13:50-14:40", "14:40-15:30"];

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        const results = {};
        for (const section of sections) {
            console.log(`Generating timetable for Section: ${section.name}`);
            const gaInput = { section, allFaculties, allRooms, timeSlots, days };
            const top3Timetables = await runGeneticAlgorithm(gaInput);
            results[section.name] = top3Timetables;
        }

        // const formattedResults = {};
        // for (const sectionName in results) {

        //     formattedResults[sectionName] = await Promise.all(results[sectionName].map(async (timetable) => {
        //         await Timetable.populate(timetable, [
        //             { path: 'classes.subject', select: 'subjectName' },
        //             { path: 'classes.faculty', select: 'facultyName' },
        //             { path: 'classes.room', select: 'roomNumber' }
        //         ]);

        //         const scheduleByDay = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [] };
        //         timetable.classes.forEach(cls => {
        //             if (scheduleByDay[cls.day]) {
        //                 scheduleByDay[cls.day].push(cls);
        //             }
        //         });

        //         for (const day in scheduleByDay) {
        //             scheduleByDay[day].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
        //         }

        //         return {
        //             fitness: timetable.fitness,
        //             schedule: scheduleByDay
        //         };
        //     }));
        // }

        // --- Replace the 'formattedResults' block with this ---

const formattedResults = {};
for (const sectionName in results) {
    
    // Find the original section object to get access to its subjects
    const section = sections.find(s => s.name === sectionName);
    if (!section) continue; // Should not happen

    formattedResults[sectionName] = results[sectionName].map((timetable) => {
        
        const scheduleByDay = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [] };

        // Manually "populate" the data
        const populatedClasses = timetable.classes.map(cls => {
            const subject = section.subjects.find(s => s._id.equals(cls.subject));
            const faculty = allFaculties.find(f => f._id.equals(cls.faculty));
            const room = allRooms.find(r => r._id.equals(cls.room));

            return {
                ...cls, // Keep day, timeSlot, etc.
                subject: subject ? { subjectName: subject.subjectName } : { subjectName: 'N/A' },
                faculty: faculty ? { facultyName: faculty.facultyName } : { facultyName: 'N/A' },
                room: room ? { roomNumber: room.roomNumber } : { roomNumber: 'N/A' }
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
            schedule: scheduleByDay
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


// --- GENETIC ALGORITHM CORE ---



// async function generateTimetableFor(req, res) {
//     try {
//         const { departmentId, year } = req.body;
//         if (!departmentId || !year) {
//             return res.status(400).json({ message: "Department and year are required." });
//         }

//         const sections = await Section.find({ department: departmentId, year: year }).populate('subjects');
//         if (sections.length === 0) {
//             return res.status(404).json({ message: "No sections found..." });
//         }

//         const allFaculties = await Faculty.find({ department: departmentId }).populate('specializedSubjects');
//         const allRooms = await Room.find();
//         const timeSlots = ["09:00-09:50", "09:50-10:40", "10:40-11:30", "11:30-12:20", "13:00-13:50", "13:50-14:40", "14:40-15:30"];
//         const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//         const results = {};

//         // --- NEW: Master tracking object for occupied resources ---
//         // This will be shared and updated by all GAs in sequence
//         const occupiedSlots = {
//             faculty: new Set(), // e.g., "facultyId-Monday-09:00-09:50"
//             room: new Set()     // e.g., "roomId-Monday-09:00-09:50"
//         };
        
//         for (const section of sections) {
//             console.log(`Generating timetable for Section: ${section.name}`);
            
//             // --- MODIFIED: Pass the occupiedSlots into the GA ---
//             const gaInput = { section, allFaculties, allRooms, timeSlots, days, occupiedSlots };

//             // This variable name was misleading, it's returning the top 1
//             const [bestTimetable] = await runGeneticAlgorithm(gaInput);
            
//             // --- NEW: Update the master 'occupiedSlots' object ---
//             // "Lock in" the resources used by the bestTimetable
//             if (bestTimetable) {
//                 bestTimetable.classes.forEach(cls => {
//                     const timeKey = `${cls.day}-${cls.timeSlot}`;
//                     occupiedSlots.faculty.add(`${cls.faculty}-${timeKey}`);
//                     occupiedSlots.room.add(`${cls.room}-${timeKey}`);
//                 });
//                 // Store the result
//                 results[section.name] = [bestTimetable]; // Keep as array for formatting
//             } else {
//                 console.warn(`GA failed to produce a timetable for ${section.name}`);
//                 results[section.name] = [];
//             }
//         }
        
//         // --- MODIFIED: Your formatting logic was buggy, this is fixed ---
//         // (This uses the fix from our previous conversation)
//         const formattedResults = {};
//         for (const sectionName in results) {
//             const section = sections.find(s => s.name === sectionName);
//             if (!section) continue;

//             formattedResults[sectionName] = await Promise.all(results[sectionName].map(async (timetable) => {
                
//                 // This 'populate' was a bug. The GA returns plain objects.
//                 // We must "manually" populate from the lists we already have.
                
//                 const scheduleByDay = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [] };

//                 const populatedClasses = timetable.classes.map(cls => {
//                     const subject = section.subjects.find(s => s._id.equals(cls.subject));
//                     const faculty = allFaculties.find(f => f._id.equals(cls.faculty));
//                     const room = allRooms.find(r => r._id.equals(cls.room));

//                     return {
//                         ...cls,
//                         subject: subject ? { subjectName: subject.subjectName } : { subjectName: 'N/A' },
//                         faculty: faculty ? { facultyName: faculty.facultyName } : { facultyName: 'N/A' },
//                         room: room ? { roomNumber: room.roomNumber } : { roomNumber: 'N/A' }
//                     };
//                 });

//                 populatedClasses.forEach(cls => {
//                     if (scheduleByDay[cls.day]) {
//                         scheduleByDay[cls.day].push(cls);
//                     }
//                 });
                
//                 for (const day in scheduleByDay) {
//                     scheduleByDay[day].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
//                 }

//                 return {
//                     fitness: timetable.fitness,
//                     schedule: scheduleByDay
//                 };
//             }));
//         }

//         res.status(200).json({
//             message: "Timetable generation process completed successfully.",
//             generatedTimetables: formattedResults,
//         });

//     } catch (error) {
//         console.error('Timetable generation failed:', error);
//         res.status(500).json({ message: "An error occurred during timetable generation." });
//     }
// };



const POPULATION_SIZE = 200;
const MAX_GENERATIONS = 500;
const MUTATION_RATE = 0.25;
const TOURNAMENT_SIZE = 5;


async function runGeneticAlgorithm(input) {
    let population = initializePopulation(input);



    for (let generation = 0; generation < MAX_GENERATIONS; generation++) {
        population = population.map(timetable => {
            const fitness = calculateFitness(timetable, input);
            return { classes: timetable.classes, fitness };
        });

        population.sort((a, b) => b.fitness - a.fitness);

        if (generation % 10 === 0) {
            console.log(`Generation ${generation}: Best Fitness = ${population[0].fitness}`);
        }

        if (population[0].fitness >= 0) {
            console.log(`Optimal solution found at generation ${generation}`);
            break; // Stop if a perfect timetable is found
        }

        let newPopulation = [];
        const eliteSize = Math.floor(POPULATION_SIZE * 0.1);
        for (let i = 0; i < eliteSize; i++) {
            newPopulation.push(population[i]);
        }

        while (newPopulation.length < POPULATION_SIZE) {
            const parent1 = selection(population);
            const parent2 = selection(population);
            let child = crossover(parent1, parent2, input);
            child = mutate(child, input, MUTATION_RATE);
            newPopulation.push(child);
        }
        population = newPopulation;
    }

    population.sort((a, b) => b.fitness - a.fitness);


    return population.slice(0, 1);

    
}

// --- GA HELPER FUNCTIONS ---


function initializePopulation(input) {
    const population = [];
    for (let i = 0; i < POPULATION_SIZE; i++) {
        let classes = [];
        input.section.subjects.forEach(subject => {

            // --- START: Smart Filtering ---

            // 1. Find faculties qualified for this subject
            const validFaculties = input.allFaculties.filter(f =>
                f.specializedSubjects.some(s => s._id.equals(subject._id))
            );
            // If no faculty can teach this, we have a data problem, but for now, fall back to all
            const facultyPool = validFaculties.length > 0 ? validFaculties : input.allFaculties;

            // 2. Find rooms suitable for this subject
            const validRooms = input.allRooms.filter(r =>
                r.capacity >= subject.requiredBatchSize &&
                (subject.isLab ? r.roomType === 'Computer Lab' : true)
            );
            const roomPool = validRooms.length > 0 ? validRooms : input.allRooms;

            // --- END: Smart Filtering ---

            for (let j = 0; j < subject.weeklyHours; j++) {

                const randomDay = input.days[Math.floor(Math.random() * input.days.length)];

                const randomTimeSlot = input.timeSlots[Math.floor(Math.random() * input.timeSlots.length)];

                // const randomRoom = input.allRooms[Math.floor(Math.random() * input.allRooms.length)];
                // const randomFaculty = input.allFaculties[Math.floor(Math.random() * input.allFaculties.length)];

                const randomRoom = roomPool[Math.floor(Math.random() * roomPool.length)];

                const randomFaculty = facultyPool[Math.floor(Math.random() * facultyPool.length)];

                // --- ADD THIS LOG ---

                // if (j === 0) { // Log only once per subject to avoid spamming the console
                //     console.log(`Assigning Faculty ID: ${randomFaculty._id}`);
                // }

                // --- END LOG ---

                classes.push({
                    subject: subject._id,
                    faculty: randomFaculty._id,
                    room: randomRoom._id,
                    day: randomDay,
                    timeSlot: randomTimeSlot
                });
            }
        });
        population.push({ classes });
    }
    return population;
}


// function calculateFitness(timetable, input) {
//     let fitness = 0;
//     const clashes = { faculty: {}, room: {}, section: {} };

//     // --- New Logging Counters ---
//     let facultyClashes = 0;
//     let roomClashes = 0;
//     let sectionClashes = 0;

//     timetable.classes.forEach(c => {

//         // ... (inside the timetable.classes.forEach loop)
//         const facultyDetails = input.allFaculties.find(f => f._id.equals(c.faculty));
//         // ... (other checks for specialization, capacity, etc.)


//         // --- NEW: Faculty Availability Check ---
//         const facultyAvailability = facultyDetails.availability.find(a => a.day === c.day);
//         if (!facultyAvailability) {
//             fitness -= 50; // Penalize if faculty is not available on this day at all
//         } else {
//             const [classStartStr, classEndStr] = c.timeSlot.split('-');
//             const classStartMinutes = timeToMinutes(classStartStr);
//             const classEndMinutes = timeToMinutes(classEndStr);

//             const facultyStartMinutes = timeToMinutes(facultyAvailability.startTime);
//             const facultyEndMinutes = timeToMinutes(facultyAvailability.endTime);

//             // Check if the class is outside the faculty's available hours
//             if (classStartMinutes < facultyStartMinutes || classEndMinutes > facultyEndMinutes) {
//                 fitness -= 50;
//             }
//         }
//         // --- END of New Check ---

//         const timeKey = `${c.day}-${c.timeSlot}`;

//         const facultyKey = `${c.faculty}-${timeKey}`;
//         if (clashes.faculty[facultyKey]) {
//             fitness -= 50;
//             facultyClashes++;
//         }
//         clashes.faculty[facultyKey] = true;

//         const roomKey = `${c.room}-${timeKey}`;
//         if (clashes.room[roomKey]) {
//             fitness -= 50;
//             roomClashes++;
//         }
//         clashes.room[roomKey] = true;

//         if (clashes.section[timeKey]) {
//             fitness -= 50;
//             sectionClashes++;
//         }
//         clashes.section[timeKey] = true;

//         // ... (the rest of the function for specialization/capacity remains the same)
//     });

//     // Add this log inside the main runGeneticAlgorithm loop where fitness is calculated
//     // console.log(`Clashes - Faculty: ${facultyClashes}, Room: ${roomClashes}, Section: ${sectionClashes}`);

//     // ... (soft constraint logic remains the same)

//     return fitness;
// }



function calculateFitness(timetable, input) {
    let fitness = 0;
    const clashes = { faculty: {}, room: {}, section: {} };

    // --- New Logging Counters ---
    let facultyClashes = 0;
    let roomClashes = 0;
    let sectionClashes = 0;

    // --- NEW: Group classes by day to check for consecutive rule ---
    const classesByDay = {};
    input.days.forEach(day => { classesByDay[day] = []; });

    timetable.classes.forEach(c => {
        // Find details (you need to add this if it's not here)
        const facultyDetails = input.allFaculties.find(f => f._id.equals(c.faculty));

        // Newly add at 23-oct/2pm
        if (!facultyDetails) {
            fitness -= 200; // Major data issue
            return fitness; // Stop processing this broken timetable
        }

        // --- NEW: Faculty Availability Check ---
        const facultyAvailability = facultyDetails.availability.find(a => a.day === c.day);
        if (!facultyAvailability) {
            fitness -= 50; // Penalize if faculty is not available on this day at all
        } else {
            const [classStartStr, classEndStr] = c.timeSlot.split('-');
            const classStartMinutes = timeToMinutes(classStartStr);
            const classEndMinutes = timeToMinutes(classEndStr);

            const facultyStartMinutes = timeToMinutes(facultyAvailability.startTime);
            const facultyEndMinutes = timeToMinutes(facultyAvailability.endTime);

            // Check if the class is outside the faculty's available hours
            if (classStartMinutes < facultyStartMinutes || classEndMinutes > facultyEndMinutes) {
                fitness -= 50;
            }
        }
        // --- END of New Check ---

        const timeKey = `${c.day}-${c.timeSlot}`;

        const facultyKey = `${c.faculty}-${timeKey}`;

        if (clashes.faculty[facultyKey]) {
            fitness -= 50;
            facultyClashes++;
        }
        clashes.faculty[facultyKey] = true;

        const roomKey = `${c.room}-${timeKey}`;
        if (clashes.room[roomKey]) {
            fitness -= 50;
            roomClashes++;
        }
        clashes.room[roomKey] = true;

        const sectionKey = timeKey; // Section clash is just for the timeKey

        if (clashes.section[sectionKey]) {
            fitness -= 50;
            sectionClashes++;
        }
        clashes.section[sectionKey] = true;
        // clashes.section[timeKey] = true;



        // ***************************************************************
        // --- START: NEW CHECK for "EXTERNAL" CLASHES ---
        // ***************************************************************
        // This checks if the resource is already booked by a
        // *previous* section's finalized timetable.
        
        // if (input.occupiedSlots.faculty.has(facultyKey)) {
        //     fitness -= 100; // Heavy penalty! Faculty is busy with another section.
        // }

        // if (input.occupiedSlots.room.has(roomKey)) {
        //     fitness -= 100; // Heavy penalty! Room is busy with another section.
        // }
        // ***************************************************************
        // --- END: NEW CHECK ---
        // ***************************************************************

        // ... (the rest of your function for specialization/capacity)
        
        // --- ADD TO LOOP: Populate classesByDay ---
        if (classesByDay[c.day]) {
            classesByDay[c.day].push(c);
        }
    });

    // --- (Any other soft constraints you have) ---


    // ***************************************************************
    // --- START: NEW CONSECUTIVE CLASS CONSISTENCY CHECK ---
    // ***************************************************************
    let consecutiveViolations = 0;
    
    // 1. Loop over each day's schedule
    for (const day of input.days) {
        
        // 2. Sort the classes for that day by their start time
        const sortedClasses = classesByDay[day].sort((a, b) => {
            const [startA] = a.timeSlot.split('-');
            const [startB] = b.timeSlot.split('-');
            return timeToMinutes(startA) - timeToMinutes(startB);
        });

        // 3. Iterate and compare adjacent classes (classA, classB)
        for (let i = 0; i < sortedClasses.length - 1; i++) {
            const classA = sortedClasses[i];
            const classB = sortedClasses[i + 1];

            // 4. Check if they are for the SAME subject
            if (classA.subject.equals(classB.subject)) {
                
                // 5. Check if they are in CONSECUTIVE time slots
                // (e.g., classA ends at "09:50" and classB starts at "09:50")
                const [, endA] = classA.timeSlot.split('-');
                const [startB] = classB.timeSlot.split('-');

                if (endA === startB) {
                    // This is a consecutive block! Now enforce the rules.
                    
                    // 6. RULE: Faculty must be the same
                    if (!classA.faculty.equals(classB.faculty)) {
                        fitness -= 100; // Heavy penalty
                        consecutiveViolations++;
                    }

                    // 7. RULE: Room must be the same
                    if (!classA.room.equals(classB.room)) {
                        fitness -= 100; // Heavy penalty
                        consecutiveViolations++;
                    }
                }
            }
        }
    }

    if (consecutiveViolations > 0) {
        // This log is helpful for debugging
        // console.log(`Consecutive Violations: ${consecutiveViolations}`);
    }
    // ***************************************************************
    // --- END: NEW CONSECUTIVE CLASS CONSISTENCY CHECK ---
    // ***************************************************************

    return fitness;
}



function selection(population) { // Tournament Selection
    let tournament = [];
    for (let i = 0; i < TOURNAMENT_SIZE; i++) {
        const randomIndex = Math.floor(Math.random() * population.length);
        tournament.push(population[randomIndex]);
    }
    tournament.sort((a, b) => b.fitness - a.fitness);
    return tournament[0];
}

function crossover(parent1, parent2, input) { // Uniform Crossover
    let childClasses = [];
    for (let i = 0; i < parent1.classes.length; i++) {
        // Randomly pick the entire class gene from either parent
        childClasses.push(Math.random() > 0.5 ? parent1.classes[i] : parent2.classes[i]);
    }
    return { classes: childClasses };
}


function mutate(timetable, input, mutationRate) {
    let classes = timetable.classes;

    // First, attempt a smart "repair" by moving to an empty slot
    if (Math.random() < 0.75) { // High chance to try the simple repair first
        const clashingClassIndex = findClashingClass(classes);
        if (clashingClassIndex !== -1) {
            const classToMove = classes[clashingClassIndex];
            const freeSlot = findFreeSlot(classToMove, classes, input);
            if (freeSlot) {
                classes[clashingClassIndex].day = freeSlot.day;
                classes[clashingClassIndex].timeSlot = freeSlot.timeSlot;
                return { classes }; // Return early if a repair was successful
            }
        }
    }

    // If repair fails or isn't chosen, attempt an "intelligent swap"
    if (Math.random() < 0.5) { // Moderate chance to try a swap
        const clashingClassIndex = findClashingClass(classes);
        if (clashingClassIndex !== -1) {
            const classA = classes[clashingClassIndex];

            // Find another random class to swap with
            const classBIndex = Math.floor(Math.random() * classes.length);
            const classB = classes[classBIndex];

            // Calculate clashes before the swap
            const clashesBefore = countClashesForClasses([classA, classB], classes);

            // Perform the swap
            const tempTimeSlot = classA.timeSlot;
            const tempDay = classA.day;
            classes[clashingClassIndex].timeSlot = classB.timeSlot;
            classes[clashingClassIndex].day = classB.day;
            classes[classBIndex].timeSlot = tempTimeSlot;
            classes[classBIndex].day = tempDay;

            // Calculate clashes after the swap
            const clashesAfter = countClashesForClasses([classes[clashingClassIndex], classes[classBIndex]], classes);

            // If the swap made things worse, revert it
            if (clashesAfter > clashesBefore) {
                const revertedTimeSlot = classes[clashingClassIndex].timeSlot;
                const revertedDay = classes[clashingClassIndex].day;
                classes[clashingClassIndex].timeSlot = classes[classBIndex].timeSlot;
                classes[clashingClassIndex].day = classes[classBIndex].day;
                classes[classBIndex].timeSlot = revertedTimeSlot;
                classes[classBIndex].day = revertedDay;
            }
        }
    }

    // Always apply a small random mutation for diversity
    if (Math.random() < mutationRate) {
        const randomIndex = Math.floor(Math.random() * classes.length);
        classes[randomIndex].timeSlot = input.timeSlots[Math.floor(Math.random() * input.timeSlots.length)];
        classes[randomIndex].day = input.days[Math.floor(Math.random() * input.days.length)];
    }

    return { classes };
}

function findClashingClass(classes) {
    const scheduleMap = {};
    for (let i = 0; i < classes.length; i++) {
        const c = classes[i];
        const timeKey = `${c.day}-${c.timeSlot}`;
        const facultyKey = `${c.faculty}-${timeKey}`;
        const roomKey = `${c.room}-${timeKey}`;
        if (scheduleMap[facultyKey] || scheduleMap[roomKey] || scheduleMap[timeKey]) return i;
        scheduleMap[facultyKey] = true;
        scheduleMap[roomKey] = true;
        scheduleMap[timeKey] = true;
    }
    return -1;
}


function findFreeSlot(classToMove, allOtherClasses, input) {
    const occupiedSlots = new Set();
    allOtherClasses.forEach(c => {
        if (c === classToMove) return;
        occupiedSlots.add(`${c.faculty}-${c.day}-${c.timeSlot}`);
        occupiedSlots.add(`${c.room}-${c.day}-${c.timeSlot}`);
        occupiedSlots.add(`${c.day}-${c.timeSlot}`);
    });
    for (const day of input.days) {
        for (const timeSlot of input.timeSlots) {
            const facultySlotKey = `${classToMove.faculty}-${day}-${timeSlot}`;
            const roomSlotKey = `${classToMove.room}-${day}-${timeSlot}`;
            const sectionSlotKey = `${day}-${timeSlot}`;
            if (!occupiedSlots.has(facultySlotKey) && !occupiedSlots.has(roomSlotKey) && !occupiedSlots.has(sectionSlotKey)) {
                return { day, timeSlot };
            }
        }
    }
    return null;
}


function countClashesForClasses(targetClasses, allClasses) {
    let clashCount = 0;
    const scheduleMap = {};

    // Build a map of all other classes
    allClasses.forEach(c => {
        if (targetClasses.includes(c)) return;
        const timeKey = `${c.day}-${c.timeSlot}`;
        scheduleMap[`faculty-${c.faculty}-${timeKey}`] = true;
        scheduleMap[`room-${c.room}-${timeKey}`] = true;
        scheduleMap[`section-${timeKey}`] = true;
    });

    // Check for clashes involving the target classes
    targetClasses.forEach(c => {
        const timeKey = `${c.day}-${c.timeSlot}`;
        const facultyKey = `faculty-${c.faculty}-${timeKey}`;
        const roomKey = `room-${c.room}-${timeKey}`;
        const sectionKey = `section-${timeKey}`;
        if (scheduleMap[facultyKey]) clashCount++;
        if (scheduleMap[roomKey]) clashCount++;
        if (scheduleMap[sectionKey]) clashCount++;
        scheduleMap[facultyKey] = true;
        scheduleMap[roomKey] = true;
        scheduleMap[sectionKey] = true;
    });

    return clashCount;
}



// *****************************************************************************
// *****************************************************************************
// *****************************************************************************
// *****************************************************************************


const createTimetable = async (req, res) => {
    try {
        const newTimetable = new Timetable({
            name: req.body.name,
            score: req.body.score,
            classes: req.body.classes
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
        const timetables = await Timetable.find({})
            .populate('classes.subject', 'subjectName subjectCode')
            .populate('classes.faculty', 'name')
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
        const timetable = await Timetable.findById(req.params.id)
            .populate('classes.subject', 'subjectName subjectCode')
            .populate('classes.faculty', 'name')
            .populate('classes.room', 'roomNumber');

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        // You might want to format the flat 'classes' array into a grouped 'schedule' object
        // here as well, so your TimetableGrid component can be reused easily.
        const scheduleByDay = { Monday: [], Tuesday: [], Wednesday: [], Thursday: [], Friday: [], Saturday: [] };
        timetable.classes.forEach(cls => {
            if (scheduleByDay[cls.day]) {
                scheduleByDay[cls.day].push(cls);
            }
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