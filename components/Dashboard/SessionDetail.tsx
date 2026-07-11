'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, MessageSquare, Bot, ClipboardList } from 'lucide-react'
import { Evaluation } from '@/types'

interface Session {
  role: string
  difficulty: string
  interviewType: string
  status: string
  selectedTechnologies?: string[]
  finalScore?: {
    overall: number
    recommendation: string
  }
  evaluations?: Evaluation[]
}

interface QuestionBlockProps {
  evaluation: Evaluation
  index: number
}

function QuestionBlock({ evaluation, index }: QuestionBlockProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const scoreColor = (score: number) => {
    if (score >= 7) return 'text-green-400'
    if (score >= 5) return 'text-yellow-400'
    return 'text-red-400'
  }
  
  const scoreBg = (score: number) => {
    if (score >= 7) return 'bg-green-400'
    if (score >= 5) return 'bg-yellow-400'
    return 'bg-red-400'
  }

  const flagColors: Record<string, string> = {
    vague: 'bg-red-500/20 text-red-400 border-red-500/30',
    no_example: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    too_short: 'bg-red-500/20 text-red-400 border-red-500/30',
    shallow: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    strong_answer: 'bg-green-500/20 text-green-400 border-green-500/30',
    excellent_depth: 'bg-green-500/20 text-green-400 border-green-500/30',
    good_communication: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    buzzword_heavy: 'bg-red-500/20 text-red-400 border-red-500/30',
    no_technical_detail: 'bg-red-500/20 text-red-400 border-red-500/30',
    off_topic: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-[#1f1f1f] rounded-xl overflow-hidden mb-4"
    >
      {/* Header — always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 
                   bg-[#111111] hover:bg-[#161616] transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Question number */}
          <span className="text-xs font-bold text-indigo-400 
                           bg-indigo-400/10 px-2 py-1 rounded-md">
            Q{index + 1}
          </span>
          
          {/* Score dots visual */}
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i < (evaluation.overall || 0)
                    ? scoreBg(evaluation.overall || 0)
                    : 'bg-[#2a2a2a]'
                }`}
              />
            ))}
          </div>
          
          {/* Overall score */}
          <span className={`font-bold text-sm 
                           ${scoreColor(evaluation.overall || 0)}`}>
            {(evaluation.overall || 0).toFixed(1)}/10
          </span>
        </div>
        
        {/* Expand icon */}
        <div className="text-gray-500">
          {isExpanded 
            ? <ChevronUp size={16} /> 
            : <ChevronDown size={16} />
          }
        </div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-5 space-y-4 bg-[#0d0d0d]">
              
              {/* Question */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList size={14} className="text-gray-500" />
                  <span className="text-xs font-semibold text-gray-500 
                                   uppercase tracking-wider">
                    Question
                  </span>
                </div>
                <div className="bg-[#111111] border border-[#1f1f1f] 
                                border-l-4 border-l-indigo-500 
                                rounded-lg p-4">
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {evaluation.questionText}
                  </p>
                </div>
              </div>

              {/* User Answer */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={14} className="text-gray-500" />
                  <span className="text-xs font-semibold text-gray-500 
                                   uppercase tracking-wider">
                    Your Answer
                  </span>
                </div>
                <div className="bg-[#161622] border border-indigo-500/20 
                                rounded-lg p-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {evaluation.answerText || 
                      <span className="text-gray-600 italic">
                        No answer provided
                      </span>
                    }
                  </p>
                </div>
              </div>

              {/* AI Feedback */}
              {evaluation.detailedFeedback && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Bot size={14} className="text-gray-500" />
                    <span className="text-xs font-semibold text-gray-500 
                                     uppercase tracking-wider">
                      AI Feedback
                    </span>
                  </div>
                  <div className="bg-[#111118] border border-[#1f1f2e] 
                                  rounded-lg p-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {evaluation.detailedFeedback}
                    </p>
                  </div>
                </div>
              )}

              {/* Score Bars */}
              <div>
                <span className="text-xs font-semibold text-gray-500 
                                 uppercase tracking-wider">
                  Scores
                </span>
                <div className="mt-3 space-y-2">
                  {[
                    { label: 'Technical', value: evaluation.technical },
                    { label: 'Clarity', value: evaluation.clarity },
                    { label: 'Depth', value: evaluation.depth },
                    { label: 'Confidence', value: evaluation.confidence },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-20 
                                       flex-shrink-0">
                        {label}
                      </span>
                      <div className="flex-1 bg-[#1f1f1f] rounded-full h-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(value / 10) * 100}%` }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className={`h-1.5 rounded-full ${scoreBg(value)}`}
                        />
                      </div>
                      <span className={`text-xs font-bold w-6 
                                       text-right ${scoreColor(value)}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flags */}
              {evaluation.flags && evaluation.flags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {evaluation.flags.map((flag: string) => (
                    <span
                      key={flag}
                      className={`text-xs px-2 py-1 rounded-md border 
                                  font-medium
                                  ${flagColors[flag] || 
                                    'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                  }`}
                    >
                      {flag.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function SessionDetail({ session }: { session: Session }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      
      {/* Session header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap mb-3">
          <span className="text-sm font-semibold text-indigo-400 
                           bg-indigo-400/10 px-3 py-1 rounded-full capitalize">
            {session.role}
          </span>
          <span className="text-sm text-gray-500 capitalize">
            {session.difficulty}
          </span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-500 capitalize">
            {session.interviewType}
          </span>
          {session.status !== 'completed' && (
            <span className="text-xs font-semibold text-amber-400 
                             bg-amber-400/10 px-2 py-1 rounded-full 
                             border border-amber-400/20">
              Incomplete
            </span>
          )}
        </div>
        
        {/* Selected technologies */}
        {session.selectedTechnologies && session.selectedTechnologies.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {session.selectedTechnologies.map((tech: string) => (
              <span key={tech}
                className="text-xs text-gray-400 bg-[#1a1a1a] 
                           border border-[#2a2a2a] px-2 py-1 rounded-md">
                {tech}
              </span>
            ))}
          </div>
        )}
        
        {/* Overall score card */}
        {session.finalScore && (
          <div className="bg-[#111111] border border-[#1f1f1f] 
                          rounded-xl p-5 flex items-center 
                          justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase 
                            tracking-wider mb-1">
                Overall Score
              </p>
              <p className={`text-4xl font-bold ${
                session.finalScore.overall >= 7 ? 'text-green-400' :
                session.finalScore.overall >= 5 ? 'text-yellow-400' :
                'text-red-400'
              }`}>
                {session.finalScore.overall.toFixed(1)}
                <span className="text-lg text-gray-600">/10</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">
                {session.evaluations?.length || 0} / 10 answered
              </p>
              <p className="text-sm text-indigo-400 font-medium">
                {session.finalScore.recommendation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Question blocks */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase 
                       tracking-wider mb-4">
          Interview Breakdown
        </h2>
        {session.evaluations?.map((evaluation: Evaluation, i: number) => (
          <QuestionBlock key={i} evaluation={evaluation} index={i} />
        ))}
      </div>
    </div>
  )
}
