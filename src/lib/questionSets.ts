import type { Question, QuestionSet } from "@/types";

export const sampleQuestions: Question[] = [
  // Easy Questions (1-8) - 10 points, -5 penalty
  {
    id: "q1",
    question: "Who was the first man created by God according to the Book of Genesis?",
    options: ["Moses", "Abraham", "Adam", "Noah"],
    correctAnswer: 2,
    difficulty: "easy",
    points: 10,
    penalty: 5,
  },
  {
    id: "q2",
    question: "How many days did God take to create the world?",
    options: ["5 days", "6 days", "7 days", "8 days"],
    correctAnswer: 1,
    difficulty: "easy",
    points: 10,
    penalty: 5,
  },
  {
    id: "q3",
    question: "Who built the ark to survive the great flood?",
    options: ["Moses", "Abraham", "Noah", "David"],
    correctAnswer: 2,
    difficulty: "easy",
    points: 10,
    penalty: 5,
  },
  {
    id: "q4",
    question: "What is the first book of the Bible?",
    options: ["Exodus", "Genesis", "Leviticus", "Psalms"],
    correctAnswer: 1,
    difficulty: "easy",
    points: 10,
    penalty: 5,
  },
  {
    id: "q5",
    question: "Who was swallowed by a great fish?",
    options: ["Jonah", "Peter", "Paul", "John"],
    correctAnswer: 0,
    difficulty: "easy",
    points: 10,
    penalty: 5,
  },
  {
    id: "q6",
    question: "How many apostles did Jesus choose?",
    options: ["10", "11", "12", "13"],
    correctAnswer: 2,
    difficulty: "easy",
    points: 10,
    penalty: 5,
  },
  {
    id: "q7",
    question: "In which town was Jesus born?",
    options: ["Nazareth", "Jerusalem", "Bethlehem", "Capernaum"],
    correctAnswer: 2,
    difficulty: "easy",
    points: 10,
    penalty: 5,
  },
  {
    id: "q8",
    question: "What did God create on the first day?",
    options: ["Animals", "Light", "Plants", "Water"],
    correctAnswer: 1,
    difficulty: "easy",
    points: 10,
    penalty: 5,
  },
  // Moderate Questions (9-16) - 20 points, -10 penalty
  {
    id: "q9",
    question: "Which king built the first temple in Jerusalem?",
    options: ["David", "Solomon", "Saul", "Hezekiah"],
    correctAnswer: 1,
    difficulty: "moderate",
    points: 20,
    penalty: 10,
  },
  {
    id: "q10",
    question: "How many plagues did God send upon Egypt?",
    options: ["7", "8", "9", "10"],
    correctAnswer: 3,
    difficulty: "moderate",
    points: 20,
    penalty: 10,
  },
  {
    id: "q11",
    question: "Who was the mother of Samuel the prophet?",
    options: ["Ruth", "Hannah", "Deborah", "Esther"],
    correctAnswer: 1,
    difficulty: "moderate",
    points: 20,
    penalty: 10,
  },
  {
    id: "q12",
    question: "What was Paul's occupation before becoming an apostle?",
    options: ["Fisherman", "Tax Collector", "Tentmaker", "Carpenter"],
    correctAnswer: 2,
    difficulty: "moderate",
    points: 20,
    penalty: 10,
  },
  {
    id: "q13",
    question: "Which prophet was taken up to heaven in a whirlwind?",
    options: ["Elijah", "Elisha", "Isaiah", "Jeremiah"],
    correctAnswer: 0,
    difficulty: "moderate",
    points: 20,
    penalty: 10,
  },
  {
    id: "q14",
    question: "How many years did the Israelites wander in the wilderness?",
    options: ["20 years", "30 years", "40 years", "50 years"],
    correctAnswer: 2,
    difficulty: "moderate",
    points: 20,
    penalty: 10,
  },
  {
    id: "q15",
    question: "Who was the Roman governor who sentenced Jesus to crucifixion?",
    options: ["Herod", "Pilate", "Caesar", "Felix"],
    correctAnswer: 1,
    difficulty: "moderate",
    points: 20,
    penalty: 10,
  },
  {
    id: "q16",
    question: "Which book of the Bible contains the Ten Commandments?",
    options: ["Genesis", "Exodus", "Leviticus", "Deuteronomy"],
    correctAnswer: 1,
    difficulty: "moderate",
    points: 20,
    penalty: 10,
  },
  // Hard Questions (17-20) - 30 points, -15 penalty
  {
    id: "q17",
    question: "In what year did King Solomon begin building the temple according to 1 Kings 6:1?",
    options: ["The 3rd year of his reign", "The 4th year of his reign", "The 5th year of his reign", "The 7th year of his reign"],
    correctAnswer: 1,
    difficulty: "hard",
    points: 30,
    penalty: 15,
  },
  {
    id: "q18",
    question: "Which prophet saw a vision of a valley of dry bones?",
    options: ["Isaiah", "Jeremiah", "Ezekiel", "Daniel"],
    correctAnswer: 2,
    difficulty: "hard",
    points: 30,
    penalty: 15,
  },
  {
    id: "q19",
    question: "What was the name of Moses' father-in-law who was a priest of Midian?",
    options: ["Hobab", "Jethro", "Reuel", "All of these names"],
    correctAnswer: 3,
    difficulty: "hard",
    points: 30,
    penalty: 15,
  },
  {
    id: "q20",
    question: "In the book of Revelation, what are the names of the two witnesses?",
    options: ["Moses and Elijah", "Enoch and Elijah", "The Bible doesn't specify their names", "Peter and Paul"],
    correctAnswer: 2,
    difficulty: "hard",
    points: 30,
    penalty: 15,
  },
];

export const sampleSet: QuestionSet = {
  id: "set-sample-1",
  title: "Biblical Foundations - Sample Set",
  questions: sampleQuestions,
  createdAt: new Date().toISOString(),
  createdBy: "system",
};

// Generate 100 question sets with varied topics
export function generateQuestionSets(): QuestionSet[] {
  const sets: QuestionSet[] = [sampleSet];
  
  const topics = [
    "Old Testament Prophets",
    "New Testament Miracles",
    "Kings of Israel",
    "Parables of Jesus",
    "Book of Acts",
    "Psalms and Proverbs",
    "Genesis Creation",
    "Exodus Journey",
    "David and Goliath",
    "Life of Paul",
  ];

  for (let i = 1; i <= 99; i++) {
    const topicIndex = i % topics.length;
    sets.push({
      id: `set-${i}`,
      title: `${topics[topicIndex]} - Set ${Math.floor(i / topics.length) + 1}`,
      questions: sampleQuestions,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      createdBy: "system",
    });
  }

  return sets;
}