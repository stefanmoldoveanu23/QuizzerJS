const verified = {
    id: 1,
    email: "characterme1001@gmail.com",
    password: "$2b$10$vm/BXpovvzbcAcpR0BmOH.awE6HAAyht73Pdh3IvNhpp4Wf4nTSga",
    username: "CharMe",
    verified: true,
    code: "random_useless_code"
};

const unverified = {
    id: 1,
    email: "characterme1001@gmail.com",
    password: "$2b$10$vm/BXpovvzbcAcpR0BmOH.awE6HAAyht73Pdh3IvNhpp4Wf4nTSga",
    username: "CharMe",
    verified: false,
    code: "random_useless_code"
};

const other_email = {
    id: 1,
    email: "stefan.moldoveanu23@gmail.com",
    password: "irrelevant",
    username: "CharMe",
    verified: true,
    code: "random_useless_code"
};

const registration = {
    email: "characterme1001@gmail.com",
    password: "$2b$10$vm/BXpovvzbcAcpR0BmOH.awE6HAAyht73Pdh3IvNhpp4Wf4nTSga",
    username: "CharMe",
}

export default {
    verified,
    unverified,
    other_email,
    registration
}