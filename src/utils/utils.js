const questionJSON = require('../questions.json');

const placeholderInfo = {
    modCreationId: "201105291830493193",
    repoDiscussionId: "640557658482540564",

}
//replace placeholders text with their actual data
const replacePlaceholders = (text, name = "User") => {


    //{name} replaced with the user's username
    text = text.replaceAll("{name}", name);

    //{modCreationId} replaced with the id
    text = text.replaceAll("{modCreationId}", placeholderInfo.modCreationId);

    //{repoDiscussionId} replaced with the id
    text = text.replaceAll("{repoDiscussionId}", placeholderInfo.repoDiscussionId);

    return text;

}

//helper function that separates categories/questions into groups
const makeGroups = (arr) => {
    const groups = [];
    for(const text of arr) {
        //if groups is an empty arr, populate the first element as an array with the first text object
        if (groups.length === 0) {
            groups.push([text]);
        }

        //Otherwise, check if the last element of arr is "full"
        else if (groups[groups.length - 1].length >= questionJSON["questionsPerPage"]) {
            // if it is, make a new array element
            groups.push([text]);
        }

        else {
            groups[groups.length - 1].push(text);
        }
    }

    return groups;
}

module.exports = {
    replacePlaceholders,
    makeGroups,
}