import { AcademicYear, Class, Subject } from "../../models/class.model";
import { limitAccess, NO_FACULTY } from "../../utils/user_decorator";
import ValidationError from "../errors/validation.error";


function subjects() {
    return Subject.find().populate("faculties");
}

function academicYears() {
    const makePopulateObject = term => {
        return {
            path: `termsClasses.${term}.subject`,
            model: "Subject",
        };
    };
    return AcademicYear.find({})
                       .populate(makePopulateObject("first"))
                       .populate(makePopulateObject("second"))
                       .populate(makePopulateObject("third"))
                       .exec();
}

function createSubject(object, args) {
    return Subject.create(args.subject);
}

function updateSubject(object, args) {
    const {_id, newSubject} = args;
    // new: true specifies that the updated version is returned
    return Subject.findByIdAndUpdate(_id, newSubject, {new: true});
}

function createAcademicYear(object, {startYear}) {
    return AcademicYear.create({startYear: startYear});
}

async function createClass(object, args) {
    const {academicYearStart, term} = args;
    const classInput = args.class;
    const academicYear = await AcademicYear
        .findOne({startYear: academicYearStart})
        .exec();

    if (!academicYear) {
        throw new ValidationError(`Could not find academic year that starts at ${academicYearStart}`);
    }

    const newClass = new Class(classInput);
    academicYear.termsClasses[term].push(newClass);
    academicYear.save();
    return newClass;
}

export const queryResolvers = {
    subjects: limitAccess(subjects, {allowed: NO_FACULTY, action: "Get all subjects"}),
    academicYears: limitAccess(academicYears, {allowed: NO_FACULTY, action: "Get all terms"}),
};

export const mutationResolvers = {
    createSubject: limitAccess(createSubject, {allowed: NO_FACULTY, action: "Create subject"}),
    updateSubject: limitAccess(updateSubject, {allowed: NO_FACULTY, action: "Update subject"}),
    createAcademicYear: limitAccess(createAcademicYear, {allowed: NO_FACULTY, action: "Create academic year"}),
    createClass: limitAccess(createClass, {allowed: NO_FACULTY, action: "Create class"}),
};
