const createIssue =  (req,res) => {
    res.send("issue created");
}

const updateIssueById = (req,res) => {
    res.send("issue updated");
}

const deleteIssueById = (req,res) => {
    res.send("issue deleted");
}

const getAllIssues = (req,res) => {
    res.send("all issues fetched");
}

const getIssueById = (req,res) => {
    res.send("issue fetched by id");
}

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
}
