"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Timer, RotateCcw, Flag, Bike, Car, Crown, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const questions = [
  {
    id: 1,
    category: "Formula 1",
    difficulty: "Easy",
    icon: "f1",
    question: "Koji F1 tim je poznat po crvenoj boji i Tifosi fanovima?",
    options: ["Mercedes", "Ferrari", "Red Bull", "McLaren"],
    answer: "Ferrari",
    explanation: "Ferrari je najpoznatiji italijanski F1 tim, a njihovi navijači se zovu Tifosi.",
  },
  {
    id: 2,
    category: "MotoGP",
    difficulty: "Easy",
    icon: "moto",
    question: "Koji MotoGP vozač je poznat pod nadimkom The Doctor?",
    options: ["Marc Márquez", "Casey Stoner", "Valentino Rossi", "Jorge Lorenzo"],
    answer: "Valentino Rossi",
    explanation: "Valentino Rossi je legendarni MotoGP vozač poznat po broju 46 i nadimku The Doctor.",
  },
  {
    id: 3,
    category: "Formula 1",
    difficulty: "Medium",
    icon: "f1",
    question: "Šta znači DRS u Formuli 1?",
    options: ["Dynamic Racing System", "Drag Reduction System", "Driver Reaction Speed", "Downforce Racing Setup"],
    answer: "Drag Reduction System",
    explanation: "DRS smanjuje otpor vazduha otvaranjem zadnjeg krila i pomaže pri preticanju.",
  },
  {
    id: 4,
    category: "MotoGP",
    difficulty: "Medium",
    icon: "moto",
    question: "Koji proizvođač je poslednjih godina veoma jak u MotoGP-u?",
    options: ["Ducati", "Suzuki", "Kawasaki", "BMW"],
    answer: "Ducati",
    explanation: "Ducati je poslednjih sezona jedan od najdominantnijih proizvođača u MotoGP-u.",
  },
  {
    id: 5,
    category: "Formula 1",
    difficulty: "Hard",
    icon: "f1",
    question: "Koja F1 staza je poznata po krivini Eau Rouge/Raidillon?",
    options: ["Monza", "Spa-Francorchamps", "Silverstone", "Suzuka"],
    answer: "Spa-Francorchamps",
    explanation: "Spa-Francorchamps u Belgiji ima jednu od najpoznatijih kombinacija krivina u motorsportu.",
  },
  {
    id: 6,
    category: "MotoGP",
    difficulty: "Hard",
    icon: "moto",
    question: "Koji broj je najpoznatije vezan za Valentina Rossija?",
    options: ["1", "12", "46", "93"],
    answer: "46",
    explanation: "Broj 46 je zaštitni znak Valentina Rossija.",
  },
  {
    id: 7,
    category: "Formula 1",
    difficulty: "Medium",
    icon: "f1",
    question: "Koliko guma standardno ima F1 bolid tokom vožnje?",
    options: ["2", "3", "4", "6"],
    answer: "4",
    explanation: "F1 bolid ima četiri točka, odnosno četiri gume tokom vožnje.",
  },
  {
    id: 8,
    category: "MotoGP",
    difficulty: "Easy",
    icon: "moto",
    question: "Koliko točkova ima MotoGP motor?",
    options: ["2", "3", "4", "6"],
    answer: "2",
    explanation: "MotoGP motocikl ima dva točka.",
  },
];

const initialLeaderboard = [
  { name: "Nemanja", score: 760, accuracy: 88 },
  { name: "Vasa", score: 710, accuracy: 82 },
  { name: "Miki", score: 660, accuracy: 76 },
  { name: "Luka", score: 590, accuracy: 71 },
];

function getDifficultyPoints(difficulty) {
  if (difficulty === "Hard") return 150;
  if (difficulty === "Medium") return 120;
  return 100;
}

function categoryIcon(type) {
  if (type === "moto") return <Bike className="h-5 w-5" />;
  return <Car className="h-5 w-5" />;
}

export default function MotorsportQuizApp() {
  const [screen, setScreen] = useState("intro");
  const [playerName, setPlayerName] = useState("Nemanja");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [leaderboard, setLeaderboard] = useState(initialLeaderboard);
  const [selectedDifficulty, setSelectedDifficulty] = useState("All"); 
  const filteredQuestions =
  selectedDifficulty === "All"
    ? questions
    : questions.filter(
        (q) => q.difficulty === selectedDifficulty
      );

const currentQuestion = filteredQuestions[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === currentQuestion?.answer;

  const result = useMemo(() => {
    const correct = answers.filter((item) => item.correct).length;
    const score = answers.reduce((sum, item) => sum + item.points, 0);
    const accuracy = answers.length ? Math.round((correct / answers.length) * 100) : 0;
    return { correct, score, accuracy };
  }, [answers]);

  const sortedLeaderboard = useMemo(() => {
    return [...leaderboard].sort((a, b) => b.score - a.score);
  }, [leaderboard]);

  function startQuiz() {
    setScreen("quiz");
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
  }

  function selectAnswer(option) {
    if (isAnswered) return;
    setSelectedAnswer(option);
  }

  function nextQuestion() {
    const correct = selectedAnswer === currentQuestion.answer;
    const points = correct ? getDifficultyPoints(currentQuestion.difficulty) : 0;

    const nextAnswers = [
      ...answers,
      {
        questionId: currentQuestion.id,
        selectedAnswer,
        correct,
        points,
      },
    ];

    setAnswers(nextAnswers);

    if (currentIndex + 1 >= filteredQuestions.length) {
      const correctCount = nextAnswers.filter((item) => item.correct).length;
      const score = nextAnswers.reduce((sum, item) => sum + item.points, 0);
      const accuracy = Math.round((correctCount / filteredQuestions.length) * 100);
      setLeaderboard((prev) => [...prev, { name: playerName || "Player", score, accuracy }]);
      setScreen("results");
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
  }

  function resetQuiz() {
    setScreen("intro");
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setAnswers([]);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.25),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.22),transparent_34%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-[28px] border border-white/10 bg-white/5 px-5 py-4 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-500 shadow-lg shadow-red-500/25">
              <Flag className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-white/50">Motorsport</p>
              <h1 className="text-xl font-black sm:text-2xl">F1 x MotoGP Quiz</h1>
            </div>
          </div>
          <div className="hidden items-center gap-2 rounded-2xl bg-white/10 px-4 py-2 text-sm text-white/70 sm:flex">
            <Trophy className="h-4 w-4 text-yellow-300" />
            Leaderboard ready
          </div>
        </header>

        <main className="grid flex-1 items-center gap-6 py-8 lg:grid-cols-[1fr_380px]">
          <section>
            <AnimatePresence mode="wait">
              {screen === "intro" && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.35 }}
                >
                  <Card className="overflow-hidden rounded-[36px] border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur-xl">
                    <CardContent className="p-6 sm:p-10">
                      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/70">
                        <Timer className="h-4 w-4" />
                        8 pitanja · F1 + MotoGP · Score system
                      </div>
                      <h2 className="max-w-3xl text-4xl font-black leading-tight sm:text-6xl">
                        Dokaži da znaš motorsport bolje od ekipe.
                      </h2>
                      <p className="mt-5 max-w-2xl text-lg leading-8 text-white/65">
                        Moderan quiz app sa kategorijama, animacijama, objašnjenjima odgovora, skorom i leaderboardom.
                      </p>

                      <div className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
                        <input
                          value={playerName}
                          onChange={(event) => setPlayerName(event.target.value)}
                          placeholder="Unesi ime igrača"
                          className="h-14 rounded-2xl border border-white/10 bg-slate-950/60 px-5 text-white outline-none ring-0 placeholder:text-white/35 focus:border-red-400"
                        />
                        <Button onClick={startQuiz} className="h-14 rounded-2xl bg-red-500 px-8 text-base font-bold text-white hover:bg-red-600">
                          Start quiz
                        </Button>
                      </div>

                      <div className="mt-8 grid gap-4 sm:grid-cols-4">
  {[
    ["All", "All questions"],
    ["Easy", "100 pts"],
    ["Medium", "120 pts"],
    ["Hard", "150 pts"],
  ].map(([label, points]) => (
    <button
      key={label}
      type="button"
      onClick={() => setSelectedDifficulty(label)}
      className={`rounded-3xl border p-4 text-left transition ${
        selectedDifficulty === label
          ? "border-red-400 bg-red-500/20"
          : "border-white/10 bg-white/5 hover:bg-white/10"
      }`}
    >
      <p className="text-sm text-white/45">Difficulty</p>
      <p className="mt-1 text-xl font-black">{label}</p>
      <p className="text-sm text-red-200">{points}</p>
    </button>
  ))}
</div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {screen === "quiz" && currentQuestion && (
                <motion.div
                  key={currentQuestion.id}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="rounded-[36px] border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur-xl">
                    <CardContent className="p-6 sm:p-10">
                      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                            {categoryIcon(currentQuestion.icon)}
                          </div>
                          <div>
                            <p className="text-sm text-white/45">Question {currentIndex + 1} / {filteredQuestions.length}</p>
                            <p className="font-bold">{currentQuestion.category}</p>
                          </div>
                        </div>
                        <div className="rounded-full bg-red-500/20 px-4 py-2 text-sm font-bold text-red-100">
                          {currentQuestion.difficulty} · {getDifficultyPoints(currentQuestion.difficulty)} pts
                        </div>
                      </div>

                      <div className="mb-7 h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          className="h-full bg-red-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
                        />
                      </div>

                      <h2 className="text-3xl font-black leading-tight sm:text-5xl">{currentQuestion.question}</h2>

                      <div className="mt-8 grid gap-4">
                        {currentQuestion.options.map((option) => {
                          const selected = selectedAnswer === option;
                          const correctOption = currentQuestion.answer === option;
                          const showCorrect = isAnswered && correctOption;
                          const showWrong = isAnswered && selected && !correctOption;

                          return (
                            <motion.button
                              key={option}
                              whileHover={!isAnswered ? { scale: 1.015 } : undefined}
                              whileTap={!isAnswered ? { scale: 0.985 } : undefined}
                              onClick={() => selectAnswer(option)}
                              className={`flex min-h-16 items-center justify-between rounded-3xl border px-5 py-4 text-left text-lg font-bold transition ${
                                showCorrect
                                  ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                                  : showWrong
                                    ? "border-red-400 bg-red-500/20 text-red-100"
                                    : selected
                                      ? "border-blue-300 bg-blue-500/20"
                                      : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10"
                              }`}
                            >
                              <span>{option}</span>
                              {showCorrect && <CheckCircle2 className="h-6 w-6" />}
                              {showWrong && <XCircle className="h-6 w-6" />}
                            </motion.button>
                          );
                        })}
                      </div>

                      <AnimatePresence>
                        {isAnswered && (
                          <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            className="mt-7 rounded-3xl border border-white/10 bg-slate-950/55 p-5"
                          >
                            <p className={`text-lg font-black ${isCorrect ? "text-emerald-300" : "text-red-300"}`}>
                              {isCorrect ? "Tačno!" : "Nije tačno."}
                            </p>
                            <p className="mt-2 text-white/65">{currentQuestion.explanation}</p>
                            <Button onClick={nextQuestion} className="mt-5 h-12 rounded-2xl bg-white px-6 font-bold text-slate-950 hover:bg-white/90">
                              {currentIndex + 1 >= filteredQuestions.length ? "Vidi rezultat" : "Sledeće pitanje"}
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {screen === "results" && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35 }}
                >
                  <Card className="rounded-[36px] border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur-xl">
                    <CardContent className="p-6 sm:p-10">
                      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-yellow-400 text-slate-950 shadow-lg shadow-yellow-400/25">
                        <Crown className="h-8 w-8" />
                      </div>
                      <h2 className="text-4xl font-black sm:text-6xl">Rezultat</h2>
                      <p className="mt-3 text-white/60">{playerName}, završio si quiz.</p>

                      <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                          <p className="text-sm text-white/45">Score</p>
                          <p className="mt-1 text-4xl font-black">{result.score}</p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                          <p className="text-sm text-white/45">Tačno</p>
                          <p className="mt-1 text-4xl font-black">{result.correct}/{filteredQuestions.length}</p>
                        </div>
                        <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                          <p className="text-sm text-white/45">Accuracy</p>
                          <p className="mt-1 text-4xl font-black">{result.accuracy}%</p>
                        </div>
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <Button onClick={startQuiz} className="h-12 rounded-2xl bg-red-500 px-6 font-bold text-white hover:bg-red-600">
                          Igraj ponovo
                        </Button>
                        <Button onClick={resetQuiz} className="h-12 rounded-2xl bg-white px-6 font-bold text-slate-950 hover:bg-white/90">
                          <RotateCcw className="mr-2 h-4 w-4" /> Reset
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <aside className="space-y-5">
            <Card className="rounded-[32px] border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur-xl">
              <CardContent className="p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-white/40">Top players</p>
                    <h3 className="text-2xl font-black">Leaderboard</h3>
                  </div>
                  <Trophy className="h-7 w-7 text-yellow-300" />
                </div>

                <div className="space-y-3">
                  {sortedLeaderboard.slice(0, 6).map((item, index) => (
                    <motion.div
                      key={`${item.name}-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.04 }}
                      className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl font-black ${index === 0 ? "bg-yellow-400 text-slate-950" : "bg-white/10 text-white"}`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-black">{item.name}</p>
                          <p className="text-sm text-white/45">Accuracy {item.accuracy}%</p>
                        </div>
                      </div>
                      <p className="text-lg font-black">{item.score}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[32px] border-white/10 bg-white/10 text-white shadow-2xl backdrop-blur-xl">
              <CardContent className="p-5">
                <p className="text-sm uppercase tracking-[0.25em] text-white/40">Categories</p>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-3xl bg-red-500/20 p-4">
                    <Car className="mb-3 h-6 w-6 text-red-200" />
                    <p className="font-black">Formula 1</p>
                    <p className="text-sm text-white/45">Speed & tactics</p>
                  </div>
                  <div className="rounded-3xl bg-blue-500/20 p-4">
                    <Bike className="mb-3 h-6 w-6 text-blue-200" />
                    <p className="font-black">MotoGP</p>
                    <p className="text-sm text-white/45">Riders & bikes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </main>
      </div>
    </div>
  );
}
