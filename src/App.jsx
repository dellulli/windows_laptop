import { useEffect, useRef, useState } from 'react'
import { useSpring, animated } from '@react-spring/web'
import LoginPage from './LoginPage'

// App title constant
const APP_TITLE = "Edward's Windows Laptop"

import kissImg from './assets/michonne_kiss.png'
import bgImage from './assets/bg.png'
import clickSound from './assets/click.mp3'
import musicFile from './assets/music.mp3'
import musicFile2 from './assets/music2.mp3'
import cursorImg from './assets/cursor.svg'
import emptyBinImg from './assets/empty_bin.webp'
import fullBinImg from './assets/Recycle_bin_full.webp'
import trashSound from './assets/trash.mp3'
import heartFilterImg from './assets/heart_filter.png'
import profilePicture from './assets/profile_picture.png'
import windowsStartImg from './assets/windows_start.png'
import letterboxdLogo from './assets/letterboxd_logo.png'
import purblePalaceLogo from './assets/purble_palace.png'

// Playlist data
const PLAYLIST = [
  {
    title: 'I Really Want To Stay At Your House',
    file: musicFile
  },
  {
    title: 'Lover, You Should\'ve Come Over',
    file: musicFile2
  }
]
import './App.css'

function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const overlayImageRef = useRef(null)
  const heartFilterRef = useRef(null)
  const faceLandmarkerRef = useRef(null)
  const animationIdRef = useRef(null)
  const clickAudioRef = useRef(null)
  const trashAudioRef = useRef(null)
  const imageCountRef = useRef(0)
  const captureCounterRef = useRef(0)  // Tracks total captures ever made (never decreases)
  const musicSliderRef = useRef(null)
  const frameCounterRef = useRef(0)  // Tracks frame number for animated grain

  // State for overlay positioning
  const [offsetX, setOffsetX] = useState(-27)
  const [offsetY, setOffsetY] = useState(-84)
  const [scale, setScale] = useState(0.6)
  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [showAbout, setShowAbout] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [showDesktop, setShowDesktop] = useState(true)
  const [showControls, setShowControls] = useState(false)
  const [capturedImages, setCapturedImages] = useState([])
  const [imageCount, setImageCount] = useState(0)
  const [showDownloadsFolder, setShowDownloadsFolder] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageToDelete, setImageToDelete] = useState(null)
  const [showMusicPlayer, setShowMusicPlayer] = useState(false)
  const [isMusciPlaying, setIsMusicPlaying] = useState(false)
  const [showKissCam, setShowKissCam] = useState(false)
  const [showPurplePalace, setShowPurplePalace] = useState(false)
  const [trashedImages, setTrashedImages] = useState([])
  const [showTrash, setShowTrash] = useState(false)
  const [imageToDeletePermanently, setImageToDeletePermanently] = useState(null)
  const [currentFilter, setCurrentFilter] = useState('normal')
  const [sliderPosition, setSliderPosition] = useState(0)
  const [isDraggingSlider, setIsDraggingSlider] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [audioCurrentTime, setAudioCurrentTime] = useState(0)
  const bgMusicRef = useRef(null)
  const [dragState, setDragState] = useState(null)
  const [draggedImageId, setDraggedImageId] = useState(null)
  const [dragImageSource, setDragImageSource] = useState(null)
  const [dragImagePos, setDragImagePos] = useState({ x: 0, y: 0 })
  const [kissCamPos, setKissCamPos] = useState({ x: 650, y: 70 })
const [downloadsPos, setDownloadsPos] = useState({ x: 50, y: 550 })
  const [musicPlayerPos, setMusicPlayerPos] = useState({ x: 1100, y: 600 })
  const [controlsWindowPos, setControlsWindowPos] = useState({ x: 400, y: 120 })
  const [trashPos, setTrashPos] = useState({ x: 70, y: 750 })
  const [purplePalacePos, setPurplePalacePos] = useState({ x: 730, y: 650 })
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)

  // Fade in animation
  const fadeProps = useSpring({ opacity: 1, from: { opacity: 0 } })

  // Load captured images from localStorage on mount
  useEffect(() => {
    const savedImages = localStorage.getItem('capturedImages')
    if (savedImages) {
      try {
        const images = JSON.parse(savedImages)
        setCapturedImages(images)
        setImageCount(images.length)
        imageCountRef.current = images.length
      } catch (error) {
        console.error('Error loading saved images:', error)
      }
    }
    // Load capture counter from localStorage
    const savedCaptureCounter = localStorage.getItem('captureCounter')
    if (savedCaptureCounter) {
      try {
        captureCounterRef.current = parseInt(savedCaptureCounter, 10)
      } catch (error) {
        console.error('Error loading capture counter:', error)
        captureCounterRef.current = 0
      }
    }
  }, [])

  // Keep imageCountRef in sync with imageCount state
  useEffect(() => {
    imageCountRef.current = imageCount
  }, [imageCount])

  // Ensure Controls stays closed when logged in
  useEffect(() => {
    if (isLoggedIn) {
      setShowControls(false)
    }
  }, [isLoggedIn])

  // Cheek and jawline landmark indices from MediaPipe Face Landmarker
  // Left cheek: index 234, Right cheek: index 454
  // Left jawline: index 206
  const LEFT_CHEEK_INDEX = 234
  const RIGHT_CHEEK_INDEX = 454
  const LEFT_JAWLINE_INDEX = 206

  // Initialize MediaPipe Face Landmarker
  useEffect(() => {
    const initializeFaceLandmarker = async () => {
      try {
        // Dynamically import MediaPipe
        const { FilesetResolver, FaceLandmarker } = await import(
          '@mediapipe/tasks-vision'
        )

        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )
        const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
        })
        faceLandmarkerRef.current = faceLandmarker
        console.log('Face Landmarker initialized successfully')
      } catch (error) {
        console.error('Failed to initialize Face Landmarker:', error)
        setCameraError(`Failed to load Face Landmarker model: ${error.message}`)
      }
    }

    initializeFaceLandmarker()

    // Add keyboard shortcuts
    const handleKeyPress = (e) => {
      if (e.key === 'c' || e.key === 'C') {
        playClickSound()
        setShowControls((prev) => !prev)
      }
      // Spacebar to pause/play music
      if (e.code === 'Space') {
        e.preventDefault()
        playClickSound()
        // Check directly from the audio element instead of state
        if (bgMusicRef.current && !bgMusicRef.current.paused) {
          bgMusicRef.current.pause()
          setIsMusicPlaying(false)
        } else if (bgMusicRef.current) {
          bgMusicRef.current.play()
          setIsMusicPlaying(true)
        }
      }
      // Right arrow to skip to next song
      if (e.code === 'ArrowRight') {
        e.preventDefault()
        handleNextSong()
      }
      // Left arrow to go to previous song
      if (e.code === 'ArrowLeft') {
        e.preventDefault()
        handlePreviousSong()
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      if (faceLandmarkerRef.current) {
        faceLandmarkerRef.current.close()
      }
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  // Listen to audio play/pause events to update UI
  useEffect(() => {
    const audioElement = bgMusicRef.current
    if (!audioElement) return

    const handlePlay = () => setIsMusicPlaying(true)
    const handlePause = () => setIsMusicPlaying(false)
    const handleTimeUpdate = () => setAudioCurrentTime(audioElement.currentTime)

    audioElement.addEventListener('play', handlePlay)
    audioElement.addEventListener('pause', handlePause)
    audioElement.addEventListener('timeupdate', handleTimeUpdate)

    return () => {
      audioElement.removeEventListener('play', handlePlay)
      audioElement.removeEventListener('pause', handlePause)
      audioElement.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [])

  // Load overlay images and preload assets
  useEffect(() => {
    // Always load michonne_kiss.png
    const kissImg_ = new Image()
    kissImg_.src = kissImg
    kissImg_.onload = () => {
      overlayImageRef.current = kissImg_
    }
    kissImg_.onerror = () => {
      setCameraError('Failed to load Michonne overlay image')
    }

    // Always load heart filter
    const heartImg = new Image()
    heartImg.src = heartFilterImg
    heartImg.onload = () => {
      heartFilterRef.current = heartImg
    }
    heartImg.onerror = () => {
      console.error('Failed to load heart filter image')
    }

    // Preload windows_start.png and bg.png for faster loading
    const preloadImage = (src) => {
      const img = new Image()
      img.src = src
    }
    preloadImage(windowsStartImg)
    preloadImage(bgImage)
    preloadImage(letterboxdLogo)
    preloadImage(purblePalaceLogo)
  }, [])

  // Start webcam
  const startWebcam = async () => {
    try {
      setCameraError(null)
      console.log('Requesting camera access...')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      console.log('Camera stream obtained:', stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        console.log('Stream assigned to video element')
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error('Video play error:', error)
            setCameraError(`Video play error: ${error.message}`)
          })
        }
        setIsWebcamActive(true)
        console.log('Webcam activated')
      }
    } catch (error) {
      console.error('Error accessing webcam:', error)
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      let errorMsg = 'Could not access webcam. Please check permissions.'
      if (error.name === 'NotAllowedError') {
        errorMsg = 'Camera permission denied. Please allow camera access in your browser settings.'
      } else if (error.name === 'NotFoundError') {
        errorMsg = 'No camera found on this device.'
      } else if (error.name === 'NotReadableError') {
        errorMsg = 'Camera is already in use by another application.'
      }
      setCameraError(errorMsg)
      setIsWebcamActive(false)
    }
  }

  // Stop webcam
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject
      stream.getTracks().forEach((track) => track.stop())
      setIsWebcamActive(false)
    }
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
    }
    // Clear canvas to black
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.fillStyle = '#000000'
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  // Convert normalized landmark coordinates to canvas pixel coordinates
  const normalizedToCanvasCoordinates = (
    normalizedX,
    normalizedY,
    canvasWidth,
    canvasHeight
  ) => {
    // Mirror X coordinate for webcam (since it's mirrored)
    const pixelX = (1 - normalizedX) * canvasWidth
    const pixelY = normalizedY * canvasHeight
    return { pixelX, pixelY }
  }

  // Add realistic film grain texture to canvas with performance optimization
  const addGrainTexture = (canvas, ctx, intensity = 0.12, frameOffset = 0) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    const length = data.length
    
    // Pseudo-random function based on position and frame for animated grain
    const seededRandom = (x, y, frame) => {
      const n = Math.sin(x * 12.9898 + y * 78.233 + frame * 43758.5453) * 43758.5453
      return n - Math.floor(n)
    }
    
    // Process pixels with reduced grain for softer, more realistic appearance
    for (let i = 0; i < length; i += 4) {
      // Calculate position for seeded randomness
      const pixelIndex = i / 4
      const y = Math.floor(pixelIndex / canvas.width)
      const x = pixelIndex % canvas.width
      
      // Generate monochrome grain with softer distribution
      // Combine seeded random with frame offset for animation
      const random1 = seededRandom(x, y, frameOffset)
      const random2 = seededRandom(x + 1, y + 1, frameOffset)
      
      // Create softer, more natural-looking grain with slight bias toward center
      const noise = (random1 + random2 - 1) * 0.5  // Average for smoother grain
      const grain = noise * 255 * intensity
      
      // Apply monochrome grain with clamping to prevent blown-out highlights/crushed blacks
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      data[i] = Math.max(0, Math.min(255, r + grain))       // Red
      data[i + 1] = Math.max(0, Math.min(255, g + grain))   // Green
      data[i + 2] = Math.max(0, Math.min(255, b + grain))   // Blue
      // data[i + 3] remains unchanged (alpha)
    }
    
    ctx.putImageData(imageData, 0, 0)
  }

  // Draw frame with face detection and overlay
  const drawFrame = () => {
    if (!videoRef.current || !canvasRef.current || !faceLandmarkerRef.current) {
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const video = videoRef.current

    // Set canvas size to match video
    if (canvas.width !== video.videoWidth) {
      canvas.width = video.videoWidth
    }
    if (canvas.height !== video.videoHeight) {
      canvas.height = video.videoHeight
    }

    // Draw video frame (mirrored for webcam effect)
    ctx.save()
    ctx.scale(-1, 1)
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height)
    ctx.restore()

    // Run face detection
    try {
      const results = faceLandmarkerRef.current.detectForVideo(video, Date.now())

      if (results.faceLandmarks && results.faceLandmarks.length > 0) {
        const landmarks = results.faceLandmarks[0]

        // Get left jawline position for michonne
        const cheekLandmark = landmarks[LEFT_JAWLINE_INDEX]
        // Get top of head position (using landmark 10 which is typically top of head)
        const topHeadLandmark = landmarks[10]

        if (cheekLandmark) {
          const { pixelX, pixelY } = normalizedToCanvasCoordinates(
            cheekLandmark.x,
            cheekLandmark.y,
            canvas.width,
            canvas.height
          )

          // Always draw michonne_kiss.png at cheek position
          if (overlayImageRef.current) {
            const img = overlayImageRef.current
            const scaledWidth = img.width * scale
            const scaledHeight = img.height * scale

            const drawX = pixelX + 40 + offsetX
            const drawY = pixelY + 60 - scaledHeight / 2 + offsetY

            ctx.globalAlpha = 1
            ctx.save()
            ctx.translate(drawX + scaledWidth / 2, drawY + scaledHeight / 2)
            ctx.scale(-1, 1)
            ctx.drawImage(
              img,
              -scaledWidth / 2,
              -scaledHeight / 2,
              scaledWidth,
              scaledHeight
            )
            ctx.restore()
            ctx.globalAlpha = 1.0
          }
        }

        // Draw heart filter above head if selected
        if (currentFilter === 'heart' && topHeadLandmark && heartFilterRef.current) {
          const { pixelX: headX, pixelY: headY } = normalizedToCanvasCoordinates(
            topHeadLandmark.x,
            topHeadLandmark.y,
            canvas.width,
            canvas.height
          )

          const heartImg = heartFilterRef.current
          const heartScale = scale * 0.3
          const heartWidth = heartImg.width * heartScale
          const heartHeight = heartImg.height * heartScale

          // Position above head
          const heartX = headX - heartWidth / 2
          const heartY = headY - heartHeight - 20

          ctx.globalAlpha = 1
          ctx.save()
          ctx.translate(heartX + heartWidth / 2, heartY + heartHeight / 2)
          ctx.scale(-1, 1)
          ctx.drawImage(
            heartImg,
            -heartWidth / 2,
            -heartHeight / 2,
            heartWidth,
            heartHeight
          )
          ctx.restore()
          ctx.globalAlpha = 1.0
        }
      }
    } catch (error) {
      console.error('Face detection error:', error)
    }

    // Apply black & white filter to entire scene
    if (currentFilter === 'blackAndWhite') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3
        data[i] = avg     // Red
        data[i + 1] = avg // Green
        data[i + 2] = avg // Blue
      }
      ctx.putImageData(imageData, 0, 0)
    }

    // Add realistic film grain texture to all frames with frame-based animation
    frameCounterRef.current++
    addGrainTexture(canvas, ctx, 0.12, frameCounterRef.current)

    animationIdRef.current = requestAnimationFrame(drawFrame)
  }

  // Start drawing when webcam is active
  useEffect(() => {
    if (isWebcamActive && videoRef.current && videoRef.current.readyState === 4) {
      drawFrame()
    }

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [isWebcamActive, offsetX, offsetY, scale, currentFilter])

  // Capture and save canvas as image to local memory
  const capturePhoto = () => {
    playClickSound()
    if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (!blob) {
          console.error('Failed to create blob from canvas')
          return
        }
        
        const reader = new FileReader()
        reader.onload = (e) => {
          const dataUrl = e.target.result
          // Increment capture counter
          captureCounterRef.current += 1
          localStorage.setItem('captureCounter', captureCounterRef.current.toString())
          
          const newImage = {
            id: Date.now(),
            dataUrl: dataUrl,
            timestamp: new Date().toLocaleString(),
            name: `michonne_kisses_${captureCounterRef.current}`
          }
          
          // Get the latest images from localStorage
          const savedImages = localStorage.getItem('capturedImages')
          const allImages = savedImages ? JSON.parse(savedImages) : []
          const updatedImages = [newImage, ...allImages]
          
          setCapturedImages(updatedImages)
          setImageCount(updatedImages.length)
          localStorage.setItem('capturedImages', JSON.stringify(updatedImages))
          console.log('Image saved! Total images:', updatedImages.length)
        }
        reader.onerror = (error) => {
          console.error('FileReader error:', error)
        }
        reader.readAsDataURL(blob)
        
        // Also download the image to browser downloads
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `michonne_kisses_${captureCounterRef.current}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        console.log('Image downloaded to browser')
      }, 'image/png')
    } else {
      console.error('Canvas ref not available')
    }
  }

  // Play click sound
  const playClickSound = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0
      clickAudioRef.current.play().catch((error) => {
        console.log('Could not play sound:', error)
      })
    }
  }

  // Handle camera icon click
  const handleCameraClick = () => {
    playClickSound()
    if (showKissCam) {
      // Close both Kiss Cam and Controls if Kiss Cam is already open
      setShowKissCam(false)
      setShowControls(false)
      stopWebcam()
    } else {
      // Open Kiss Cam
      setShowKissCam(true)
      setShowControls(false)
      if (!isWebcamActive) {
        startWebcam()
      }
    }
  }

  // Handle desktop icon click
  const handleDesktopIconClick = () => {
    playClickSound()
  }

  // Handle Downloads folder click
  const handleDownloadsFolderClick = () => {
    playClickSound()
    setShowDownloadsFolder(!showDownloadsFolder)
  }

  // Handle close Downloads folder
  const handleCloseDownloads = () => {
    playClickSound()
    setShowDownloadsFolder(false)
    setSelectedImage(null)
  }

  // Handle delete image
  const handleDeleteImage = (imageId) => {
    playClickSound()
    setImageToDelete(imageId)
  }

  // Confirm delete image
  const confirmDeleteImage = () => {
    playClickSound()
    const updatedImages = capturedImages.filter((img) => img.id !== imageToDelete)
    setCapturedImages(updatedImages)
    localStorage.setItem('capturedImages', JSON.stringify(updatedImages))
    setImageToDelete(null)
    if (selectedImage?.id === imageToDelete) {
      setSelectedImage(null)
    }
    console.log('Image deleted! Remaining:', updatedImages.length)
  }

  // Cancel delete
  const cancelDeleteImage = () => {
    playClickSound()
    setImageToDelete(null)
  }

  // Handle music player toggle
  const handleMusicClick = () => {
    playClickSound()
    setShowMusicPlayer(!showMusicPlayer)
  }

  // Handle Purple Palace click
  const handlePurplePalaceClick = () => {
    playClickSound()
    setShowPurplePalace(!showPurplePalace)
  }

  // Handle close Purple Palace
  const handleClosePurplePalace = () => {
    playClickSound()
    setShowPurplePalace(false)
  }

  // Handle play/pause music
  const handlePlayPauseMusic = () => {
    playClickSound()
    if (isMusciPlaying) {
      bgMusicRef.current?.pause()
      setIsMusicPlaying(false)
    } else {
      bgMusicRef.current?.play()
      setIsMusicPlaying(true)
    }
  }

  // Handle next song
  const handleNextSong = () => {
    playClickSound()
    const nextIndex = (currentSongIndex + 1) % PLAYLIST.length
    setCurrentSongIndex(nextIndex)
    setSliderPosition(0)
    setAudioCurrentTime(0)
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.currentTime = 0
      bgMusicRef.current.src = PLAYLIST[nextIndex].file
      bgMusicRef.current.load()
      // Auto-play the next song
      setTimeout(() => {
        bgMusicRef.current?.play().catch(err => console.log('Play error:', err))
        setIsMusicPlaying(true)
      }, 100)
    }
  }

  // Handle previous song
  const handlePreviousSong = () => {
    playClickSound()
    const prevIndex = (currentSongIndex - 1 + PLAYLIST.length) % PLAYLIST.length
    setCurrentSongIndex(prevIndex)
    setSliderPosition(0)
    setAudioCurrentTime(0)
    if (bgMusicRef.current) {
      bgMusicRef.current.pause()
      bgMusicRef.current.currentTime = 0
      bgMusicRef.current.src = PLAYLIST[prevIndex].file
      bgMusicRef.current.load()
      // Auto-play the previous song
      setTimeout(() => {
        bgMusicRef.current?.play().catch(err => console.log('Play error:', err))
        setIsMusicPlaying(true)
      }, 100)
    }
  }

  // Handle close music player
  const handleCloseMusicPlayer = () => {
    playClickSound()
    setShowMusicPlayer(false)
  }

  // Handle trash icon click
  const handleTrashClick = () => {
    playClickSound()
    setShowTrash(!showTrash)
  }

  // Handle close trash
  const handleCloseTrash = () => {
    playClickSound()
    setShowTrash(false)
  }

  // Move image to trash
  const moveImageToTrash = (imageId) => {
    const imageToMove = capturedImages.find((img) => img.id === imageId)
    if (imageToMove) {
      if (trashAudioRef.current) {
        trashAudioRef.current.currentTime = 0
        trashAudioRef.current.volume = 1.0
        trashAudioRef.current.playbackRate = 1.5
        trashAudioRef.current.play().catch((error) => {
          console.log('Could not play trash sound:', error)
        })
      }
      setTrashedImages([...trashedImages, imageToMove])
      const updatedImages = capturedImages.filter((img) => img.id !== imageId)
      setCapturedImages(updatedImages)
      localStorage.setItem('capturedImages', JSON.stringify(updatedImages))
      if (selectedImage?.id === imageId) {
        setSelectedImage(null)
      }
    }
  }

  // Restore image from trash
  const restoreImageFromTrash = (imageId) => {
    playClickSound()
    const imageToRestore = trashedImages.find((img) => img.id === imageId)
    if (imageToRestore) {
      setCapturedImages([imageToRestore, ...capturedImages])
      const updatedTrash = trashedImages.filter((img) => img.id !== imageId)
      setTrashedImages(updatedTrash)
      localStorage.setItem('capturedImages', JSON.stringify([imageToRestore, ...capturedImages]))
    }
  }

  // Permanently delete from trash
  const confirmPermanentDeleteImage = () => {
    playClickSound()
    const updatedTrash = trashedImages.filter((img) => img.id !== imageToDeletePermanently)
    setTrashedImages(updatedTrash)
    setImageToDeletePermanently(null)
  }

  // Cancel permanent delete
  const cancelPermanentDeleteImage = () => {
    playClickSound()
    setImageToDeletePermanently(null)
  }

  // Handle window dragging
  const handleMouseDown = (e, windowType, currentPos) => {
    if (e.button !== 0) return // Only left mouse button
    const startX = e.clientX - currentPos.x
    const startY = e.clientY - currentPos.y
    setDragState({
      window: windowType,
      startX,
      startY
    })
  }

  // Handle mouse move for dragging
  useEffect(() => {
    if (!dragState && !draggedImageId) return

    const handleMouseMove = (e) => {
      if (dragState) {
        const newX = e.clientX - dragState.startX
        const newY = e.clientY - dragState.startY

        if (dragState.window === 'kissCam') {
          setKissCamPos({ x: newX, y: newY })
        } else if (dragState.window === 'downloads') {
          setDownloadsPos({ x: newX, y: newY })
        } else if (dragState.window === 'musicPlayer') {
          setMusicPlayerPos({ x: newX, y: newY })
        } else if (dragState.window === 'controlsWindow') {
          setControlsWindowPos({ x: newX, y: newY })
        } else if (dragState.window === 'trash') {
          setTrashPos({ x: newX, y: newY })
        } else if (dragState.window === 'purplePalace') {
          setPurplePalacePos({ x: newX, y: newY })
        }
      } else if (draggedImageId) {
        setDragImagePos({ x: e.clientX - 30, y: e.clientY - 30 })
      }
    }

    const handleMouseUp = (e) => {
      if (draggedImageId) {
        // Check if dropped on desktop icons
        const trashIconRect = document.getElementById('trash-icon')?.getBoundingClientRect()
        const downloadsIconRect = document.getElementById('downloads-icon')?.getBoundingClientRect()
        
        // Check if dropped on open windows
        const downloadsWindowRect = document.getElementById('downloads-window')?.getBoundingClientRect()
        const trashWindowRect = document.getElementById('trash-window')?.getBoundingClientRect()
        
        // From downloads to trash (icon or window)
        if (dragImageSource === 'downloads') {
          const droppedOnTrashIcon = trashIconRect &&
            e.clientX >= trashIconRect.left &&
            e.clientX <= trashIconRect.right &&
            e.clientY >= trashIconRect.top &&
            e.clientY <= trashIconRect.bottom
          
          const droppedOnTrashWindow = trashWindowRect &&
            e.clientX >= trashWindowRect.left &&
            e.clientX <= trashWindowRect.right &&
            e.clientY >= trashWindowRect.top &&
            e.clientY <= trashWindowRect.bottom
          
          if (droppedOnTrashIcon || droppedOnTrashWindow) {
            moveImageToTrash(draggedImageId)
          }
        } 
        // From trash to downloads (icon or window)
        else if (dragImageSource === 'trash') {
          const droppedOnDownloadsIcon = downloadsIconRect &&
            e.clientX >= downloadsIconRect.left &&
            e.clientX <= downloadsIconRect.right &&
            e.clientY >= downloadsIconRect.top &&
            e.clientY <= downloadsIconRect.bottom
          
          const droppedOnDownloadsWindow = downloadsWindowRect &&
            e.clientX >= downloadsWindowRect.left &&
            e.clientX <= downloadsWindowRect.right &&
            e.clientY >= downloadsWindowRect.top &&
            e.clientY <= downloadsWindowRect.bottom
          
          if (droppedOnDownloadsIcon || droppedOnDownloadsWindow) {
            restoreImageFromTrash(draggedImageId)
          }
        }
        setDraggedImageId(null)
        setDragImageSource(null)
      }
      
      setDragState(null)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [dragState, draggedImageId])

  // Handle close button
  const handleCloseKissCam = () => {
    playClickSound()
    setShowKissCam(false)
    stopWebcam()
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} onLogout={() => setIsLoggedIn(false)} />
  }

  return (
    <div style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      width: '100%',
      height: '100vh',
      overflow: 'hidden',
      cursor: `url(${cursorImg}) 4 12, auto`
    }}>
      <audio ref={clickAudioRef} src={clickSound} />
      <audio ref={bgMusicRef} src={PLAYLIST[currentSongIndex].file} loop />
      <audio ref={trashAudioRef} src={trashSound} />

      {showDesktop ? (
        // Desktop view with folders and camera icon - Two columns layout
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '80px',
          padding: '20px',
          height: '100%',
          width: '100%'
        }}>
          {/* Column 1 - Downloads, Music.mp3, Purple Palace */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            alignItems: 'flex-start'
          }}>
            {/* Downloads Folder */}
            <div 
              id="downloads-icon"
              onClick={handleDownloadsFolderClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📁</div>
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Downloads</div>
            </div>

            {/* Music.mp3 */}
            <div 
              onClick={handleMusicClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🎵</div>
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Music.mp3</div>
            </div>

            {/* Purple Palace */}
            <div 
              onClick={handlePurplePalaceClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
              }}
            >
              <img 
                src={purblePalaceLogo}
                alt="Purple Palace"
                style={{
                  width: '48px',
                  height: '48px',
                  objectFit: 'contain'
                }}
              />
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Purble Palace</div>
            </div>
          </div>

          {/* Column 2 - Kiss Cam, Letterboxd, Trash */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            alignItems: 'flex-start'
          }}>
            {/* Kiss Cam */}
            <div 
              onClick={handleCameraClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
              }}
            >
              <div style={{ 
                fontSize: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: 'scale(1)',
                transition: 'transform 0.1s'
              }}>📷</div>
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Kiss Cam</div>
            </div>

            {/* Letterboxd */}
            <div 
              onClick={() => {
                playClickSound()
                window.open('https://dellulli.github.io/memory-room/letterboxd', '_blank')
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
              }}
            >
              <img 
                src={letterboxdLogo}
                alt="Letterboxd"
                style={{
                  width: '56px',
                  height: '56px',
                  objectFit: 'contain'
                }}
              />
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Letterboxd</div>
            </div>

            {/* Trash */}
            <div 
              id="trash-icon"
              onClick={handleTrashClick}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '8px',
                width: '90px',
                height: '110px',
                textAlign: 'center',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.5))'
              }}
            >
              <img 
                src={trashedImages.length > 0 ? fullBinImg : emptyBinImg}
                alt="Trash"
                style={{
                  width: '56px',
                  height: '56px',
                  objectFit: 'contain'
                }}
              />
              <div style={{
                fontSize: '12px',
                color: '#ffff00',
                textShadow: '2px 2px 3px black',
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'bold',
                backgroundColor: 'rgba(0, 0, 139, 0.5)',
                padding: '2px 6px',
                borderRadius: '3px'
              }}>Trash</div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Kiss Cam Modal */}
      {showKissCam && (
        <animated.div style={{
          ...fadeProps,
          position: 'fixed',
          top: `${kissCamPos.y}px`,
          left: `${kissCamPos.x}px`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px',
          gap: '15px',
          zIndex: 1000
        }}>
          <div className="main-container">
            <div 
              className="title"
              onMouseDown={(e) => handleMouseDown(e, 'kissCam', kissCamPos)}
              style={{ 
                cursor: dragState?.window === 'kissCam' ? 'grabbing' : 'grab',
                borderBottom: dragState?.window === 'kissCam' ? '2px solid #ffffff' : 'none'
              }}
            >
              <h1>💋 Michonne's Kiss Cam</h1>
              <button 
                onClick={handleCloseKissCam}
                style={{
                  marginLeft: 'auto',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  outline: 'none',
                  backgroundColor: '#d85c5c'
                }}
              >
                ✕
              </button>
            </div>

            <div className="container-inner webcam-main">
              {cameraError && (
                <div className="error-message">
                  ⚠️ {cameraError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div className="canvas-container">
                  <canvas
                    ref={canvasRef}
                    className="webcam-canvas"
                    style={{ 
                      display: 'block',
                      backgroundColor: isWebcamActive ? 'transparent' : '#000000'
                    }}
                  />
                </div>

                {/* Filter Options Panel */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: '#c0c0c0',
                  border: '1px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  borderRadius: '2px'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                    color: '#000080'
                  }}>
                    Filters:
                  </div>
                  <button
                    onClick={() => {
                      playClickSound()
                      setCurrentFilter('normal')
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: currentFilter === 'normal' ? '#000080' : '#c0c0c0',
                      color: currentFilter === 'normal' ? 'white' : 'black',
                      border: '1px solid',
                      borderColor: currentFilter === 'normal' ? '#000080' : '#dfdfdf #808080 #808080 #dfdfdf',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      outline: 'none'
                    }}
                  >
                    Normal
                  </button>
                  <button
                    onClick={() => {
                      playClickSound()
                      setCurrentFilter('blackAndWhite')
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: currentFilter === 'blackAndWhite' ? '#000080' : '#c0c0c0',
                      color: currentFilter === 'blackAndWhite' ? 'white' : 'black',
                      border: '1px solid',
                      borderColor: currentFilter === 'blackAndWhite' ? '#000080' : '#dfdfdf #808080 #808080 #dfdfdf',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      outline: 'none'
                    }}
                  >
                    B&W
                  </button>
                  <button
                    onClick={() => {
                      playClickSound()
                      setCurrentFilter('heart')
                    }}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: currentFilter === 'heart' ? '#dd1c73' : '#c0c0c0',
                      color: currentFilter === 'heart' ? 'white' : 'black',
                      border: '1px solid',
                      borderColor: currentFilter === 'heart' ? '#dd1c73' : '#dfdfdf #808080 #808080 #dfdfdf',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      outline: 'none'
                    }}
                  >
                    ♥ Heart
                  </button>
                </div>
              </div>

              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                style={{ display: 'none' }}
                onLoadedMetadata={() => {
                  console.log('Video metadata loaded')
                  if (isWebcamActive) {
                    drawFrame()
                  }}
                }
              />

              <div className="button-group">
                <button
                  onClick={startWebcam}
                  disabled={isWebcamActive}
                  className="btn btn-primary"
                  style={{ outline: 'none', color: '#000080', fontWeight: 'bold' }}
                >
                  ▶ Start
                </button>
                <button
                  onClick={stopWebcam}
                  disabled={!isWebcamActive}
                  className="btn btn-secondary"
                  style={{ outline: 'none', color: '#000080', fontWeight: 'bold' }}
                >
                  ■ Stop
                </button>
                <button
                  onClick={capturePhoto}
                  disabled={!isWebcamActive}
                  className="btn btn-capture"
                  style={{ outline: 'none', color: '#000080', fontWeight: 'bold' }}
                >
                  ● Capture
                </button>
                <button
                  onClick={() => {
                    playClickSound()
                    setShowControls(!showControls)
                  }}
                  className="btn btn-primary"
                  style={{ outline: 'none', color: '#000080', fontWeight: 'bold' }}
                >
                  ⊙ {showControls ? 'Hide' : 'Show'} Controls
                </button>
              </div>
            </div>

            <div className="statusbar">
              <div className="left">Michonne Kiss Cam</div>
              <div className="right">&nbsp;</div>
            </div>
          </div>
        </animated.div>
      )}

      {/* Controls Window - Separate Window */}
      {showControls && (
        <div className="main-container secondary window" style={{
          position: 'fixed',
          top: `${controlsWindowPos.y}px`,
          left: `${controlsWindowPos.x}px`,
          zIndex: 1002
        }}>
          <div 
            className="title"
            onMouseDown={(e) => handleMouseDown(e, 'controlsWindow', controlsWindowPos)}
            style={{ 
              cursor: dragState?.window === 'controlsWindow' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'controlsWindow' ? '2px solid #ffffff' : 'none'
            }}
          >
            <h1>⚙️ Controls</h1>
            <button 
              onClick={() => {
                playClickSound()
                setShowControls(false)
              }}
              style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>



          <div className="container-inner controls-container">
            {!isWebcamActive && (
              <>
                <p>Welcome to Michonne's Kiss Cam!</p>
                <p>Click the "Kiss Cam" application to begin using your webcam.</p>
              </>
            )}

            {isWebcamActive && (
              <>
                <h3>Michonne Position & Size</h3>

                <div className="control-group">
                  <label>
                    Offset X: <span className="value">{offsetX}</span>
                  </label>
                  <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: '#666', top: '50%' }}></div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      value={offsetX}
                      onChange={(e) => setOffsetX(Number(e.target.value))}
                      className="slider"
                      style={{ position: 'relative', zIndex: 1, width: '100%' }}
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label>
                    Offset Y: <span className="value">{offsetY}</span>
                  </label>
                  <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: '#666', top: '50%' }}></div>
                    <input
                      type="range"
                      min="-150"
                      max="150"
                      value={offsetY}
                      onChange={(e) => setOffsetY(Number(e.target.value))}
                      className="slider"
                      style={{ position: 'relative', zIndex: 1, width: '100%' }}
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label>
                    Scale: <span className="value">{scale.toFixed(2)}x</span>
                  </label>
                  <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
                    <div style={{ position: 'absolute', width: '100%', height: '1px', backgroundColor: '#666', top: '50%' }}></div>
                    <input
                      type="range"
                      min="0.5"
                      max="3"
                      step="0.1"
                      value={scale}
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="slider"
                      style={{ position: 'relative', zIndex: 1, width: '100%' }}
                    />
                  </div>
                </div>

                <p className="tips">💡 Adjust the controls to change Michonne's position to your liking, then capture!</p>
              </>
            )}
          </div>

          <div className="statusbar">
            <div className="left">^_^</div>
            {isWebcamActive && (
              <button
                onClick={() => {
                  playClickSound()
                  setOffsetX(-27)
                  setOffsetY(-84)
                  setScale(0.6)
                }}
                style={{
                  marginLeft: 'auto',
                  padding: '2px 12px',
                  backgroundColor: '#c0c0c0',
                  color: 'black',
                  border: '1px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '10px',
                  fontFamily: 'Arial, sans-serif',
                  flex: 1,
                  maxWidth: '150px',
                  outline: 'none'
                }}
              >
                Reset Position
              </button>
            )}
          </div>
        </div>
      )}

      {/* Downloads Folder Window */}
      {showDownloadsFolder && (
        <div id="downloads-window" style={{
          position: 'fixed',
          top: `${downloadsPos.y}px`,
          left: `${downloadsPos.x}px`,
          backgroundColor: '#c0c0c0',
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
          width: '600px',
          maxHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001
        }}>
          {/* Title bar */}
          <div 
            style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: dragState?.window === 'downloads' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'downloads' ? '2px solid #ffffff' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'downloads', downloadsPos)}
          >
            <h1 style={{ margin: '2px 4px', fontSize: '14px', fontWeight: 'bold' }}>📁 Downloads</h1>
            <button 
              onClick={handleCloseDownloads}
              style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>

          {/* File list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px',
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            gap: '10px'
          }}>
            {capturedImages.map((image) => (
              <div
                key={image.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '4px',
                  minWidth: '70px',
                  textAlign: 'center',
                  borderRadius: '2px',
                  transition: 'background 0.1s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#000080'
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.color = 'black'
                }}
              >
                <div
                  onMouseDown={(e) => {
                    if (e.button === 0) {
                      setDraggedImageId(image.id)
                      setDragImageSource('downloads')
                      setDragImagePos({ x: e.clientX - 30, y: e.clientY - 30 })
                    }
                  }}
                  onClick={() => {
                    playClickSound()
                    setSelectedImage(image)
                  }}
                  style={{
                    cursor: 'grab',
                    position: 'relative',
                    userSelect: 'none'
                  }}
                >
                  <img 
                    src={image.dataUrl} 
                    alt={`Capture ${image.id}`}
                    style={{
                      width: '60px',
                      height: '60px',
                      objectFit: 'cover',
                      border: '1px solid #808080'
                    }}
                  />
                </div>
                <div style={{
                  fontSize: '10px',
                  fontFamily: 'Arial, sans-serif',
                  wordBreak: 'break-all'
                }}>
                  {image.name || `kiss_${image.id}`}
                </div>
              </div>
            ))}
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex',
            height: '20px',
            borderTop: '1px solid #dfdfdf',
            backgroundColor: '#c0c0c0',
            fontSize: '12px',
            alignItems: 'center',
            paddingLeft: '2px'
          }}>
            <span>{capturedImages.length} object(s)</span>
          </div>
        </div>
      )}

      {/* Music Player Modal */}
      {showMusicPlayer && (
        <div style={{
          position: 'fixed',
          top: `${musicPlayerPos.y}px`,
          left: `${musicPlayerPos.x}px`,
          backgroundColor: '#c0c0c0',
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
          width: '280px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000
        }}>
          {/* Title bar */}
          <div 
            style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: dragState?.window === 'musicPlayer' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'musicPlayer' ? '2px solid #ffffff' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'musicPlayer', musicPlayerPos)}
          >
            <h1 style={{ margin: '2px 4px', fontSize: '14px', fontWeight: 'bold' }}>Music Player</h1>
            <button 
              onClick={handleCloseMusicPlayer}
              style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>

          {/* Player content */}
          <div style={{
            padding: '15px',
            textAlign: 'center'
          }}>
            <div style={{
              marginBottom: '15px',
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#000080'
            }}>
              {isMusciPlaying ? 'Now Playing:' : 'Music Player'}
            </div>
            <div style={{
              marginBottom: '15px',
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#000080',
              minHeight: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {PLAYLIST[currentSongIndex].title}
            </div>

            {/* Play/Pause and Navigation arrows */}
            <div style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '15px'
            }}>
              <button
                onClick={handlePreviousSong}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px',
                  padding: '0',
                  outline: 'none',
                  color: '#000080'
                }}
              >
                ◀
              </button>
              <button
                onClick={handlePlayPauseMusic}
                style={{
                  width: '60px',
                  padding: '8px',
                  backgroundColor: '#c0c0c0',
                  color: 'black',
                  border: '1px solid',
                  borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '11px',
                  fontFamily: 'Arial, sans-serif',
                  outline: 'none'
                }}
              >
                {isMusciPlaying ? 'PAUSE' : 'PLAY'}
              </button>
              <button
                onClick={handleNextSong}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '24px',
                  padding: '0',
                  outline: 'none',
                  color: '#000080'
                }}
              >
                ▶
              </button>
            </div>

            {/* Sound Waves Animation */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '30px',
              gap: '3px'
            }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '3px',
                    height: isMusciPlaying ? '20px' : '5px',
                    backgroundColor: '#000080',
                    borderRadius: '1px',
                    animation: isMusciPlaying ? `wave 0.6s ease-in-out ${i * 0.1}s infinite` : 'none',
                    transition: 'height 0.3s ease'
                  }}
                />
              ))}
              <style>{`
                @keyframes wave {
                  0%, 100% { height: 5px; }
                  50% { height: 20px; }
                }
              `}</style>
            </div>

            {/* Seekable Audio Player */}
            <div style={{
              marginTop: '15px',
              marginBottom: '10px'
            }}>
              <input
                ref={musicSliderRef}
                type="range"
                min="0"
                max="100"
                value={isDraggingSlider ? sliderPosition : (bgMusicRef.current ? (bgMusicRef.current.currentTime / bgMusicRef.current.duration * 100) || 0 : 0)}
                onMouseDown={() => setIsDraggingSlider(true)}
                onMouseUp={() => setIsDraggingSlider(false)}
                onKeyDown={(e) => {
                  if (e.code === 'ArrowRight') {
                    e.preventDefault()
                    handleNextSong()
                  }
                  if (e.code === 'ArrowLeft') {
                    e.preventDefault()
                    handlePreviousSong()
                  }
                }}
                onChange={(e) => {
                  const newValue = parseFloat(e.target.value)
                  setSliderPosition(newValue)
                  if (bgMusicRef.current) {
                    bgMusicRef.current.currentTime = (newValue / 100) * bgMusicRef.current.duration
                  }
                }}
                style={{
                  width: '100%',
                  height: '6px',
                  cursor: 'pointer',
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  background: '#dfdfdf',
                  borderRadius: '3px',
                  outline: 'none'
                }}
              />
              <style>{`
                input[type="range"]::-webkit-slider-thumb {
                  -webkit-appearance: none;
                  appearance: none;
                  width: 14px;
                  height: 14px;
                  background: #000080;
                  cursor: pointer;
                  border-radius: 2px;
                  border: 1px solid #dfdfdf;
                }
                input[type="range"]::-moz-range-thumb {
                  width: 14px;
                  height: 14px;
                  background: #000080;
                  cursor: pointer;
                  border-radius: 2px;
                  border: 1px solid #dfdfdf;
                }
              `}</style>
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex',
            height: '20px',
            borderTop: '1px solid #dfdfdf',
            backgroundColor: '#c0c0c0',
            fontSize: '10px',
            alignItems: 'center',
            paddingLeft: '2px'
          }}>
            {(() => {
              const currentTime = isDraggingSlider 
                ? (sliderPosition / 100) * (bgMusicRef.current?.duration || 150)
                : audioCurrentTime
              const minutes = Math.floor(currentTime / 60)
              const seconds = Math.floor(currentTime % 60)
              const durationMinutes = Math.floor((bgMusicRef.current?.duration || 150) / 60)
              const durationSeconds = Math.floor((bgMusicRef.current?.duration || 150) % 60)
              return (
                <span>
                  {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')} / {String(durationMinutes).padStart(2, '0')}:{String(durationSeconds).padStart(2, '0')}
                </span>
              )
            })()}
          </div>
        </div>
      )}

      {/* Trash Window */}
      {showTrash && (
        <div id="trash-window" style={{
          position: 'fixed',
          top: `${trashPos.y}px`,
          left: `${trashPos.x}px`,
          backgroundColor: '#c0c0c0',
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
          width: '600px',
          maxHeight: '500px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000
        }}>
          {/* Title bar */}
          <div 
            style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: dragState?.window === 'trash' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'trash' ? '2px solid #ffffff' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'trash', trashPos)}
          >
            <h1 style={{ margin: '2px 4px', fontSize: '14px', fontWeight: 'bold' }}>🗑️ Trash</h1>
            <button 
              onClick={handleCloseTrash}
              style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>

          {/* File list */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px',
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            gap: '10px'
          }}>
            {trashedImages.length === 0 ? (
              <div style={{
                width: '100%',
                textAlign: 'center',
                padding: '40px 20px',
                color: '#666',
                fontSize: '14px'
              }}>
                Trash is empty
              </div>
            ) : (
              trashedImages.map((image) => (
                <div
                  key={image.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px',
                    minWidth: '70px',
                    textAlign: 'center',
                    borderRadius: '2px',
                    transition: 'background 0.1s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#000080'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'black'
                  }}
                >
                  <div
                    onMouseDown={(e) => {
                      if (e.button === 0) {
                        setDraggedImageId(image.id)
                        setDragImageSource('trash')
                        setDragImagePos({ x: e.clientX - 30, y: e.clientY - 30 })
                      }
                    }}
                    style={{
                      cursor: 'grab',
                      position: 'relative',
                      userSelect: 'none'
                    }}
                  >
                    <img 
                      src={image.dataUrl} 
                      alt={`Trash ${image.id}`}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        border: '1px solid #808080',
                        opacity: 0.7,
                        position: 'relative'
                      }}
                    />
                    {/* Red X button */}
                    <button
                      onClick={() => {
                        playClickSound()
                        setImageToDeletePermanently(image.id)
                      }}
                      style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: '20px',
                        height: '20px',
                        padding: '0',
                        backgroundColor: '#c00000',
                        color: 'white',
                        border: '1px solid #800000',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10,
                        outline: 'none'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div style={{
                    fontSize: '10px',
                    fontFamily: 'Arial, sans-serif',
                    wordBreak: 'break-all'
                  }}>
                    trash_{image.name || `${image.id}`}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex',
            height: '20px',
            borderTop: '1px solid #dfdfdf',
            backgroundColor: '#c0c0c0',
            fontSize: '12px',
            alignItems: 'center',
            paddingLeft: '2px'
          }}>
            <span>{trashedImages.length} object(s)</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {imageToDelete && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1002,
          cursor: 'auto'
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040',
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            cursor: 'auto'
          }}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: 'white',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <h2 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>⚠️ Confirm Delete</h2>
            </div>

            {/* Content */}
            <div style={{
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                Are you sure you want to delete this photo?
              </p>
              <p style={{ fontSize: '12px', color: '#666', marginBottom: '20px' }}>
                This action cannot be undone.
              </p>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={confirmDeleteImage}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c00000',
                    color: 'white',
                    border: '1px solid #800000',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Yes, Delete
                </button>
                <button
                  onClick={cancelDeleteImage}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c0c0c0',
                    color: 'black',
                    border: '1px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {imageToDeletePermanently && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1002,
          cursor: 'auto'
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040',
            display: 'flex',
            flexDirection: 'column',
            width: '320px',
            cursor: 'auto'
          }}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #c00000, #ff0000)',
              color: 'white',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <h2 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>⚠️ Delete Forever?</h2>
            </div>

            {/* Content */}
            <div style={{
              padding: '20px',
              textAlign: 'center'
            }}>
              <p style={{ marginBottom: '20px', fontSize: '14px' }}>
                Permanently delete this photo from trash?
              </p>
              <p style={{ fontSize: '12px', color: '#c00000', marginBottom: '20px', fontWeight: 'bold' }}>
                This cannot be recovered!
              </p>

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={confirmPermanentDeleteImage}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c00000',
                    color: 'white',
                    border: '1px solid #800000',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Delete Forever
                </button>
                <button
                  onClick={cancelPermanentDeleteImage}
                  style={{
                    padding: '6px 20px',
                    backgroundColor: '#c0c0c0',
                    color: 'black',
                    border: '1px solid',
                    borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                >
                  Keep
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1003,
          cursor: 'pointer'
        }} onClick={() => {
          playClickSound()
          setSelectedImage(null)
        }}>
          <div style={{
            backgroundColor: '#c0c0c0',
            border: '2px solid',
            borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
            boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040',
            maxWidth: '90%',
            maxHeight: '90%',
            display: 'flex',
            flexDirection: 'column',
            cursor: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            {/* Title bar */}
            <div style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: 'white',
              padding: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none'
            }}>
              <h2 style={{ margin: '0', fontSize: '14px', fontWeight: 'bold' }}>💋 Capture - {selectedImage.timestamp}</h2>
              <button 
                onClick={() => {
                  playClickSound()
                  setSelectedImage(null)
                }}
                style={{
                  marginLeft: 'auto',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  outline: 'none',
                  backgroundColor: '#d85c5c'
                }}
              >
                ✕
              </button>
            </div>

            {/* Image */}
            <div style={{
              padding: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'auto'
            }}>
              <img 
                src={selectedImage.dataUrl} 
                alt="Full size capture"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Purple Palace Window */}
      {showPurplePalace && (
        <div style={{
          position: 'fixed',
          top: `${purplePalacePos.y}px`,
          left: `${purplePalacePos.x}px`,
          backgroundColor: '#c0c0c0',
          border: '2px solid',
          borderColor: '#dfdfdf #808080 #808080 #dfdfdf',
          boxShadow: '1px 1px 0 #ffffff, -1px -1px 0 #404040, inset 1px 1px 0 #ffffff, inset -1px -1px 0 #808080',
          width: '300px',
          height: '250px',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000
        }}>
          {/* Title bar */}
          <div 
            style={{
              background: 'linear-gradient(to right, #000080, #1084d7)',
              color: '#ffff00',
              padding: '2px 2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              cursor: dragState?.window === 'purplePalace' ? 'grabbing' : 'grab',
              borderBottom: dragState?.window === 'purplePalace' ? '2px solid #ffffff' : 'none'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'purplePalace', purplePalacePos)}
          >
            <h1 style={{ margin: '2px 4px', fontSize: '14px', fontWeight: 'bold' }}>Purble Palace</h1>
            <button 
              onClick={handleClosePurplePalace}
              style={{
                marginLeft: 'auto',
                padding: '2px 6px',
                cursor: 'pointer',
                fontWeight: 'bold',
                outline: 'none',
                backgroundColor: '#d85c5c'
              }}
            >
              ✕
            </button>
          </div>

          {/* Video player */}
          <div style={{
            flex: 1,
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000000'
          }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Tsddt5pGhZ4?autoplay=1"
              title="Purple Palace Build Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                border: 'none'
              }}
            />
          </div>

          {/* Status bar */}
          <div style={{
            display: 'flex',
            height: '20px',
            borderTop: '1px solid #dfdfdf',
            backgroundColor: '#c0c0c0',
            fontSize: '10px',
            alignItems: 'center',
            paddingLeft: '2px'
          }}>
            <span>🎮 Purple Palace - Build Video</span>
          </div>
        </div>
      )}

      {/* Dragging image overlay */}
      {draggedImageId && dragImageSource && (
        <div
          style={{
            position: 'fixed',
            top: `${dragImagePos.y}px`,
            left: `${dragImagePos.x}px`,
            pointerEvents: 'none',
            zIndex: 9999
          }}
        >
          <img
            src={
              dragImageSource === 'downloads'
                ? capturedImages.find((img) => img.id === draggedImageId)?.dataUrl
                : trashedImages.find((img) => img.id === draggedImageId)?.dataUrl
            }
            alt="dragging"
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              border: '2px solid #000080',
              boxShadow: '0 0 10px rgba(0,0,0,0.5)',
              borderRadius: '2px',
              opacity: 0.9
            }}
          />
        </div>
      )}

      {/* Bottom Left Profile Picture */}
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          zIndex: 100
        }}
      >
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            borderRadius: '50%',
            overflow: 'hidden',
            width: '56px',
            height: '56px',
            outline: 'none'
          }}
        >
          <img
            src={profilePicture}
            alt="Profile"
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid rgba(255, 255, 255, 0.6)'
            }}
          />
        </button>

        {/* Profile Dropdown Menu */}
        {showProfileMenu && (
          <div
            style={{
              position: 'absolute',
              bottom: '64px',
              left: '0',
              backgroundColor: 'rgba(32, 32, 32, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '4px',
              minWidth: '160px',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
              zIndex: 10000,
              backdropFilter: 'blur(10px)'
            }}
          >
            <button
              onClick={() => {
                setShowProfileMenu(false)
                setIsLoggedIn(false)
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                cursor: 'pointer',
                textAlign: 'left',
                outline: 'none'
              }}
            >
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
