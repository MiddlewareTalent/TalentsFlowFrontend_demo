"use client"

import { useState, useEffect, useRef } from "react"
import { CalendarDays, Cake, Award, Sparkles, X, Heart } from "lucide-react"
import Confetti from "react-confetti"
import { motion, AnimatePresence } from "framer-motion"

const MessageBox = ({ state }) => {
  const [visible, setVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })
  const modalRef = useRef(null)

  const today = new Date()
  const doj = new Date(state.dateOfJoining)
  const dob = new Date(state.dateOfBirth)

  const isWorkAnniversary = today.getMonth() === doj.getMonth() && today.getDate() === doj.getDate()

  const isBirthday = today.getMonth() === dob.getMonth() && today.getDate() === dob.getDate()

  let message = ""
  let years = 0

  if (isWorkAnniversary) {
    years = today.getFullYear() - doj.getFullYear()
    if (years > 0) {
      message = `🎉 Wishing you a happy ${years}-year work anniversary, ${state.firstName}. Your dedication and contributions are truly valued.`
    }
  } else if (isBirthday) {
    message = `🎂 Happy Birthday, ${state.firstName}! Wishing you a fantastic year ahead filled with success and happiness.`
  }

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Check localStorage to control visibility
  useEffect(() => {
    const dismissed = localStorage.getItem("messageBoxDismissed")
    if (!dismissed && message) {
      setVisible(true)
      // Start confetti after a short delay
      setTimeout(() => setShowConfetti(true), 300)
    }
  }, [message])

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose()
      }
    }

    if (visible) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [visible])

  const handleClose = () => {
    setShowConfetti(false)
    setVisible(false)
    localStorage.setItem("messageBoxDismissed", "true")
  }

  if (!message || !visible) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/40"
        >
          {showConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={200}
              gravity={0.05}
            />
          )}

          <motion.div
            ref={modalRef}
            initial={{ scale: 0.8, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 20, opacity: 0 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 300,
            }}
            className="relative w-full max-w-xl mx-4 sm:mx-auto overflow-hidden"
          >
            <motion.div
              className="relative rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
              style={{
                background: "linear-gradient(135deg, #a78bfa 0%, #3b82f6 100%)",
              }}
            >
              {/* Animated background shimmer */}
              <motion.div
                className="absolute inset-0 opacity-20"
                animate={{
                  background: [
                    "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.4) 25%, rgba(255,255,255,0.4) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.4) 75%)",
                    "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.4) 25%, rgba(255,255,255,0.4) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.4) 75%)",
                  ],
                }}
                transition={{
                  x: { repeat: Number.POSITIVE_INFINITY, duration: 20, ease: "linear" },
                  backgroundPosition: ["0px 0px", "100px 100px"],
                }}
                style={{
                  backgroundSize: "100px 100px",
                }}
              />

              <div className="relative p-8">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white shadow-lg z-10 transition-colors"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </motion.button>

                {/* Floating Sparkle Icons */}
                <motion.div
                  className="absolute top-0 right-0 -mt-4 -mr-4"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                >
                  <Sparkles className="w-14 h-14 text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]" />
                </motion.div>

                {/* Header */}
                <motion.div
                  className="flex items-center mb-6"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.div
                    className="p-4 rounded-full mr-4 bg-white/90 shadow-lg"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    {isBirthday ? (
                      <Cake className="w-10 h-10 text-purple-600" />
                    ) : (
                      <Award className="w-10 h-10 text-blue-600" />
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">
                      {isBirthday ? "Happy Birthday!" : `${years} Year Service Anniversary!`}
                    </h3>
                    <p className="text-white/80 text-sm font-medium">{state.department}</p>
                  </motion.div>
                </motion.div>

                {/* Message */}
                <motion.div
                  className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg mb-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.h2
                    className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {state.firstName}
                  </motion.h2>
                  <motion.p
                    className="text-gray-700 text-lg mt-4 leading-relaxed"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {message}
                  </motion.p>
                </motion.div>

                {/* Footer */}
                <motion.div
                  className="flex items-center justify-between pt-4"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center text-white/90">
                    <CalendarDays className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{today.toLocaleDateString()}</span>
                  </div>
                  <motion.div className="flex items-center text-white font-bold" whileHover={{ scale: 1.05 }}>
                    <Heart className="w-4 h-4 mr-2 text-red-400" />
                    <span>Middleware Talents</span>
                  </motion.div>
                </motion.div>

                {/* Animated Decorative Elements */}
                <motion.div
                  className="absolute bottom-6 left-4"
                  animate={{
                    y: [0, -5, 0],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.2,
                  }}
                >
                  <div className="w-5 h-5 rounded-full bg-yellow-300 blur-[1px]"></div>
                </motion.div>
                <motion.div
                  className="absolute bottom-12 left-10"
                  animate={{
                    y: [0, -7, 0],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                >
                  <div className="w-4 h-4 rounded-full bg-teal-300 blur-[1px]"></div>
                </motion.div>
                <motion.div
                  className="absolute top-14 right-14"
                  animate={{
                    y: [0, -6, 0],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 0.8,
                  }}
                >
                  <div className="w-6 h-6 rounded-full bg-purple-300 blur-[1px]"></div>
                </motion.div>
                <motion.div
                  className="absolute bottom-20 right-10"
                  animate={{
                    y: [0, -8, 0],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                >
                  <div className="w-3 h-3 rounded-full bg-blue-300 blur-[1px]"></div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MessageBox
