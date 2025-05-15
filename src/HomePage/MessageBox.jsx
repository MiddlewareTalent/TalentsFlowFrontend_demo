"use client"

import { useState, useEffect, useRef } from "react"
import { CalendarDays, Gift, Award, X, Star, Music, PartyPopper } from "lucide-react"
import Confetti from "react-confetti"
import { motion, AnimatePresence } from "framer-motion"

const CelebrationCard = ({ state }) => {
  const [visible, setVisible] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })
  const [animationComplete, setAnimationComplete] = useState(false)
  const modalRef = useRef(null)
  const audioRef = useRef(null)

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
      message = `Congratulations on ${years} incredible years with us! Your journey has been remarkable, and your contributions continue to inspire everyone around you.`
    }
  } else if (isBirthday) {
    message = `Today is all about celebrating you! May your day be filled with joy, laughter, and unforgettable moments that make this birthday your best one yet.`
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
    const dismissed = localStorage.getItem("celebrationCardDismissed")
    if (!dismissed && message) {
      setVisible(true)
      // Start confetti after a short delay
      setTimeout(() => {
        setShowConfetti(true)
        // Play sound effect
        if (audioRef.current) {
          audioRef.current.play().catch((e) => console.log("Audio playback prevented:", e))
        }
      }, 300)
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
    localStorage.setItem("celebrationCardDismissed", "true")
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }

  if (!message || !visible) return null

  const cardColors = isBirthday
    ? "from-rose-500 via-pink-500 to-purple-500"
    : "from-emerald-500 via-teal-500 to-cyan-500"

  const iconColor = isBirthday ? "text-pink-400" : "text-teal-400"
  const accentColor = isBirthday ? "bg-pink-400" : "bg-teal-400"

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/50"
        >
          {/* Audio element for celebration sound */}
          <audio ref={audioRef} src="/celebration-sound.mp3" preload="auto" />

          {showConfetti && (
            <Confetti
              width={windowSize.width}
              height={windowSize.height}
              recycle={false}
              numberOfPieces={300}
              gravity={0.05}
              colors={
                isBirthday
                  ? ["#ec4899", "#d946ef", "#f472b6", "#f9a8d4", "#fdf2f8"]
                  : ["#10b981", "#14b8a6", "#06b6d4", "#67e8f9", "#ecfeff"]
              }
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
            onAnimationComplete={() => setAnimationComplete(true)}
          >
            <motion.div
             // className="relative rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
              style={{
                background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
              }}
              className={`relative rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] bg-gradient-to-br ${cardColors}`}
            >
              {/* Animated glass effect */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.5) 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 70%, rgba(255,255,255,0.5) 0%, transparent 50%)",
                  ],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              />

              {/* Floating particles */}
              {animationComplete && (
                <>
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-white/40"
                      initial={{
                        x: Math.random() * 100 - 50,
                        y: Math.random() * 100 - 50,
                        opacity: 0.3 + Math.random() * 0.7,
                        scale: 0.5 + Math.random() * 1.5,
                      }}
                      animate={{
                        y: [0, -Math.random() * 100 - 20, 0],
                        x: [0, Math.random() * 40 - 20, 0],
                        opacity: [0.3, 0.8, 0.3],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3 + Math.random() * 5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: Math.random() * 2,
                      }}
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </>
              )}

              <div className="relative p-8">
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1, backgroundColor: "#ef4444" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md text-white shadow-lg z-10 transition-colors hover:bg-red-500"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </motion.button>

                {/* Floating Icon */}
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
                  <PartyPopper className="w-14 h-14 text-yellow-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.7)]" />
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
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  >
                    {isBirthday ? (
                      <Gift className="w-10 h-10 text-pink-600" />
                    ) : (
                      <Award className="w-10 h-10 text-teal-600" />
                    )}
                  </motion.div>
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-2xl font-bold text-white drop-shadow-md">
                      {isBirthday ? "Celebrate Your Day!" : `${years} Years of Excellence!`}
                    </h3>
                    <p className="text-white/80 text-sm font-medium">{state.department}</p>
                  </motion.div>
                </motion.div>

                {/* Message */}
                <motion.div
                  className="backdrop-blur-md bg-white/20 rounded-xl p-6 shadow-lg mb-6 border border-white/30"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <motion.div
                    className="absolute -top-3 -left-3 w-16 h-16"
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Star className="w-8 h-8 text-yellow-300 drop-shadow-[0_0_5px_rgba(250,204,21,0.7)]" />
                  </motion.div>

                  <motion.h2
                    className="text-3xl font-bold text-white"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {state.firstName}
                  </motion.h2>
                  <motion.p
                    className="text-white/90 text-lg mt-4 leading-relaxed"
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    {message}
                  </motion.p>
                </motion.div>

                {/* Animated decorative line */}
                <motion.div
                  className={`h-1 rounded-full ${accentColor} mb-6`}
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                />

                {/* Footer */}
                <motion.div
                  className="flex items-center justify-between pt-2"
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center text-white/90">
                    <CalendarDays className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{today.toLocaleDateString()}</span>
                  </div>
                  <motion.div className="flex items-center text-white font-bold" whileHover={{ scale: 1.05 }}>
                    <Music className={`w-4 h-4 mr-2 ${iconColor}`} />
                    <span>Middleware Talents</span>
                  </motion.div>
                </motion.div>

                {/* Animated Decorative Elements */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full"
                    animate={{
                      y: [0, -(5 + Math.random() * 10), 0],
                      opacity: [0.4, 0.8, 0.4],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: Math.random() * 2,
                    }}
                    style={{
                      background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)`,
                      top: `${20 + Math.random() * 60}%`,
                      left: `${10 + Math.random() * 80}%`,
                      filter: "blur(1px)",
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CelebrationCard
