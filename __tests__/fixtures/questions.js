const with_image = {
    id: 1,
    quizId: 1,
    Quiz: {
        id: 1,
        userId: 1,
        name: "my_quiz",
        description: "my_description"
    },
    type: "singleChoice",
    position: 0,
    statement: "my_statement",
    choices: [
        "choice_0",
        "choice1",
        "choice 2"
    ],
    answer: [
        1
    ],
    image: true
};

const without_image = {
    id: 1,
    quizId: 1,
    Quiz: {
        id: 1,
        userId: 1,
        name: "my_quiz",
        description: "my_description"
    },
    type: "singleChoice",
    position: 0,
    statement: "my_statement",
    choices: [
        "choice_0",
        "choice1",
        "choice 2"
    ],
    answer: [
        1
    ],
    image: false
};

export default {
    with_image,
    without_image
}