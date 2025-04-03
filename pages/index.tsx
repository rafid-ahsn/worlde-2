import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Input = (props: any) => <input {...props} className="border px-2 py-1 rounded w-full" />;
const Button = (props: any) => <button {...props} className="bg-blue-500 text-white px-4 py-1 rounded mt-2" />;

const Wordle = () => {
  const router = useRouter();
  const wordParam = router.query.word || "";

  const [input, setInput] = useState("");
  const [guesses, setGuesses] = useState<string[]>([]);
  const [result, setResult] = useState<string[][]>([]);
  const [word, setWord] = useState((typeof wordParam === "string" ? wordParam : "").toLowerCase());

  useEffect(() => {
    if (guesses.length === 0) return;
    const lastGuess = guesses[guesses.length - 1];
    const feedback = lastGuess.split("").map((char, idx) => {
      if (char === word[idx]) return "correct";
      else if (word.includes(char)) return "present";
      else return "absent";
    });
    setResult([...result, feedback]);
  }, [guesses]);

  const handleGuess = () => {
    if (input.length !== word.length) return;
    setGuesses([...guesses, input.toLowerCase()]);
    setInput("");
  };

  if (!word) {
    return <WordSetter />;
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Wordle Clone</h1>
      <div className="mb-4">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={word.length}
        />
        <Button onClick={handleGuess}>Guess</Button>
      </div>
      <div className="space-y-2">
        {guesses.map((guess, i) => (
          <div key={i} className="flex space-x-2">
            {guess.split("").map((char, j) => (
              <span
                key={j}
                className={\`w-10 h-10 flex items-center justify-center rounded text-white font-bold \${{
                  correct: "bg-green-500",
                  present: "bg-yellow-500",
                  absent: "bg-gray-500"
                }[result[i][j]]}\`}
              >
                {char.toUpperCase()}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const WordSetter = () => {
  const [word, setWord] = useState("");

  const handleSet = () => {
    if (word.length >= 3 && word.length <= 10) {
      const encodedWord = encodeURIComponent(word.toLowerCase());
      const gameUrl = \`\${window.location.origin}/?word=\${encodedWord}\`;
      navigator.clipboard.writeText(gameUrl).then(() => alert("Game link copied to clipboard!"));
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4">Set a Word for Wordle</h1>
      <Input
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter a word between 3-10 letters"
      />
      <Button onClick={handleSet}>Generate Game Link</Button>
    </div>
  );
};

export default Wordle;