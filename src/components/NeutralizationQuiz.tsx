import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

interface NeutralizationQuizProps {
  show: boolean;
  neutralizationPoint: number;
}

export default function NeutralizationQuiz({ show, neutralizationPoint }: NeutralizationQuizProps) {
  const [options, setOptions] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const correctAnswer = neutralizationPoint;

  useEffect(() => {
    if (show) {
      generateOptions();
    }
  }, [show, neutralizationPoint]);

  const generateOptions = () => {
    // 10의 배수인 선택지 생성 (10, 20, ..., 100)
    const possibleValues = Array.from({ length: 10 }, (_, i) => (i + 1) * 10);
    
    // 정답을 제외한 값들
    const withoutCorrect = possibleValues.filter(v => v !== correctAnswer);
    
    // 랜덤하게 4개 선택
    const shuffled = [...withoutCorrect].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 4);
    
    // 정답 추가하고 오름차순 정렬
    const finalOptions = [...selected, correctAnswer].sort((a, b) => a - b);
    
    setOptions(finalOptions);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswer = (value: number) => {
    setSelectedAnswer(value);
    setShowResult(true);
  };

  if (!show) return null;

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className="glass-panel p-6 rounded-xl animate-fade-in mb-8">
      <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
        🎓 중화점 확인 문제
      </h2>
      <p className="text-center text-lg mb-6 text-gray-700">
        이 실험에서 중화점에 도달했을 때 첨가한 염기의 부피는?
      </p>
      
      <div className="grid grid-cols-5 gap-3 mb-6">
        {options.map((option) => (
          <Button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={showResult}
            variant={selectedAnswer === option ? 'default' : 'outline'}
            className={`h-16 text-lg font-bold transition-all ${
              selectedAnswer === option
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white scale-105'
                : 'hover:scale-105'
            }`}
          >
            {option} mL
          </Button>
        ))}
      </div>

      {showResult && (
        <div
          className={`p-4 rounded-lg flex items-center gap-3 animate-scale-in ${
            isCorrect
              ? 'bg-green-100 border-2 border-green-400'
              : 'bg-red-100 border-2 border-red-400'
          }`}
        >
          {isCorrect ? (
            <>
              <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-green-800 text-lg">정답입니다! 🎉</p>
                <p className="text-green-700">
                  중화점은 H⁺와 OH⁻의 몰수가 같아지는 지점으로, 이 실험에서는 {correctAnswer}mL입니다.
                </p>
              </div>
            </>
          ) : (
            <>
              <XCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-bold text-red-800 text-lg">틀렸습니다.</p>
                <p className="text-red-700">
                  정답은 <span className="font-bold">{correctAnswer} mL</span>입니다. 중화점에서는 BTB 용액이 초록색으로 변하며 온도가 가장 높습니다.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
