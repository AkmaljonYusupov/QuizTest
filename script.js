let allQuestions = []
let shuffledQuestions = []
let currentQuestion = 0
let userAnswers = []
let username = ''
let phoneNumber = ''
let selectedTopic = ''
let language = 'uz'
const questionTime = 15
let totalTime = 0
let initialTotalTime = 0
let questionInterval, totalInterval
let warningShown = false

const quizContainer = document.getElementById('quiz')
const resultContainer = document.getElementById('result')
const nextBtn = document.getElementById('nextBtn')
const prevBtn = document.getElementById('prevBtn')
const progressBar = document.getElementById('progressBar')
const totalTimerDisplay = document.getElementById('totalTimer')

// Vaqtni MM:SS formatiga aylantirish funksiyasi
function formatTime(seconds) {
	const minutes = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${minutes.toString().padStart(2, '0')}:${secs
		.toString()
		.padStart(2, '0')}`
}

const langData = {
	uz: {
		enterName: 'Ismingizni va familyangizni kiriting',
		enterPhone: 'Telefon raqamingizni kiriting: +998-(##)-###-##-##',
		start: 'Testni Boshlash',
		selectTopic: '-- Mavzuni tanlang --',
		topicHTML: 'HTML',
		topicCSS: 'CSS',
		topicJS: 'JavaScript',
		enterYourName: 'Masalan: Akmaljon Yusupov',
		enterCount: 'Nechta savol bo‘lsin?',
		timeLeft: 'Bu savol uchun vaqt',
		totalTime: 'Umumiy vaqt tugashiga:',
		prepTitle: 'Testga tayyorlaning!',
		prepTimer: `Boshlanishiga`,
		questionTimerSuffix: 'soniya qoldi',
		minuteLabel: 'daqiqa',
		secondLabel: 'soniya',
		questionLabel: 'Savol',
		yourAnswer: 'Sizning javobingiz:',
		correctAnswer: 'To‘g‘ri javob:',
		resultTitle: 'Sizning natijangiz:',
		timeUp: '⏰ Umumiy vaqt tugadi!',
		resultText: 'Natija:',
		download: 'Natijani PDF ko‘rinishida yuklab olish',
		noAnswer: 'Tanlanmagan',
		finish: 'Yakunlash',
		next: 'Keyingi',
		prev: 'Ortga',
		noSelection: '❗ Savolga javob belgilang!',
		invalidName:
			'Iltimos, ism va familyani to‘liq kiriting, faqat harflar va probeldan foydalaning, uzunligi kamida 10 belgi bo‘lsin (masalan: Akmaljon Yusupov)!',
		invalidPhone: 'Iltimos, to‘liq 9 ta raqam kiriting: +998-(##)-###-##-##',
		invalidTopic: 'Iltimos, mavzuni tanlang!',
		invalidCount:
			'Iltimos, savollar sonini to‘g‘ri kiriting (1 yoki undan ko‘p)!',
		notFound: 'Tanlangan mavzu bo‘yicha savollar topilmadi!',
		exceeds: count => `Tanlangan mavzuda faqat ${count} ta savol mavjud!`,
		downloadTitle: 'Quiz Natijasi',
		name: 'Ism:',
		phone: 'Telefon:',
		topic: 'Mavzu:',
		language: 'Til:',
		lang_uz: 'O‘zbekcha',
		lang_en: 'Inglizcha',
		lang_ru: 'Ruscha',
		date: 'Sana:',
		time: 'Vaqt:',
		score: 'Ball:',
		timeSpent: 'Sarflangan vaqt:',
		timeWarning: '⏰ Diqqat! Test vaqti tugashiga 20 soniya qoldi!',
	},
	en: {
		enterName: 'Enter your first and last name',
		enterPhone: 'Enter your phone number: +998-(##)-###-##-##',
		start: 'Start the Test',
		selectTopic: '-- Select topic --',
		topicHTML: 'HTML',
		topicCSS: 'CSS',
		topicJS: 'JavaScript',
		enterYourName: 'For example: Akmaljon Yusupov',
		enterCount: 'How many questions?',
		timeLeft: 'Time left for this question',
		totalTime: 'Time remaining:',
		prepTitle: 'Get ready for the test!',
		prepTimer: `Starts in`,
		questionTimerSuffix: 'seconds',
		minuteLabel: 'minutes',
		secondLabel: 'seconds',
		questionLabel: 'Question',
		yourAnswer: 'Your answer:',
		correctAnswer: 'Correct answer:',
		resultTitle: 'Your result:',
		timeUp: '⏰ Time is up!',
		resultText: 'Result:',
		download: 'Download result as PDF',
		noAnswer: 'Not selected',
		finish: 'Finish',
		next: 'Next',
		prev: 'Previous',
		noSelection: '❗ Please select an answer!',
		invalidName:
			'Please enter both first and last name, using only letters and spaces, with a minimum length of 10 characters (e.g., Akmaljon Yusupov)!',
		invalidPhone: 'Please enter all 9 digits: +998-(##)-###-##-##',
		invalidTopic: 'Please select a topic!',
		invalidCount: 'Please enter a valid number of questions (1 or more)!',
		notFound: 'No questions found for the selected topic!',
		exceeds: count =>
			`Only ${count} questions available for the selected topic!`,
		downloadTitle: 'Quiz Result',
		name: 'Name:',
		phone: 'Phone:',
		topic: 'Topic:',
		language: 'Language:',
		lang_uz: 'Uzbek',
		lang_en: 'English',
		lang_ru: 'Russian',
		date: 'Date:',
		time: 'Time:',
		score: 'Score:',
		timeSpent: 'Time Spent:',
		timeWarning: '⏰ Warning! Only 20 seconds left to complete the test!',
	},
	ru: {
		enterName: 'Введите свое имя и фамилию',
		enterPhone: 'Введите номер телефона: +998-(##)-###-##-##',
		start: 'Начать тест',
		selectTopic: '-- Выберите тему --',
		topicHTML: 'HTML',
		topicCSS: 'CSS',
		topicJS: 'JavaScript',
		enterYourName: 'Например: Акмалжон Юсупов',
		enterCount: 'Сколько вопросов?',
		timeLeft: 'Оставшееся время для вопроса',
		totalTime: 'Оставшееся общее время:',
		prepTitle: 'Подготовьтесь к тесту!',
		prepTimer: `Начнётся через `,
		questionTimerSuffix: 'секунд',
		minuteLabel: 'минут',
		secondLabel: 'секунд',
		questionLabel: 'Вопрос',
		yourAnswer: 'Ваш ответ:',
		correctAnswer: 'Правильный ответ:',
		resultTitle: 'Ваш результат:',
		timeUp: '⏰ Время вышло!',
		resultText: 'Результат:',
		download: 'Скачать результат в PDF',
		noAnswer: 'Не выбран',
		finish: 'Завершить',
		next: 'Далее',
		prev: 'Назад',
		noSelection: '❗ Пожалуйста, выберите ответ!',
		invalidName:
			'Пожалуйста, введите имя и фамилию полностью, используя только буквы и пробелы, минимальная длина 10 символов (например, Акмалжон Юсупов)!',
		invalidPhone: 'Пожалуйста, введите все 9 цифр: +998-(##)-###-##-##',
		invalidTopic: 'Пожалуйста, выберите тему!',
		invalidCount:
			'Пожалуйста, введите правильное количество вопросов (1 или больше)!',
		notFound: 'Вопросы по выбранной теме не найдены!',
		exceeds: count => `Доступно только ${count} вопросов по выбранной теме!`,
		downloadTitle: 'Результат теста',
		name: 'Имя:',
		phone: 'Телефон:',
		topic: 'Тема:',
		language: 'Язык:',
		lang_uz: 'Узбекский',
		lang_en: 'Английский',
		lang_ru: 'Русский',
		date: 'Дата:',
		time: 'Время:',
		score: 'Балл:',
		timeSpent: 'Затраченное время:',
		timeWarning: '⏰ Внимание! Осталось 20 секунд до завершения теста!',
	},
}

function getLangText(key, ...args) {
	const val = langData[language]?.[key]
	return typeof val === 'function' ? val(...args) : val || key
}

function showToast(message, type = 'info') {
	const toastContainer = document.getElementById('toastContainer')
	const icon =
		{
			success: 'check-circle-fill',
			danger: 'exclamation-octagon-fill',
			warning: 'exclamation-triangle-fill',
			info: 'info-circle-fill',
		}[type] || 'info-circle-fill'

	const toast = document.createElement('div')
	toast.className = `toast align-items-center text-bg-${type} border-0 show mb-2`
	toast.setAttribute('role', 'alert')
	toast.setAttribute('aria-live', 'assertive')
	toast.setAttribute('aria-atomic', 'true')
	toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                <i class="bi bi-${icon} me-2"></i>${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `
	toastContainer.appendChild(toast)
	setTimeout(() => toast.remove(), 5000)
}

document.addEventListener('DOMContentLoaded', () => {
	const phoneInput = document.getElementById('phoneInput')
	const usernameInput = document.getElementById('usernameInput')
	const startButton = document.getElementById('startQuizButton')

	if (phoneInput) {
		if (typeof IMask === 'undefined') {
			console.error(
				'IMask is not loaded. Please check the CDN or network connection.'
			)
			showToast(
				'Telefon raqam maskasi yuklanmadi. Iltimos, internet aloqasini tekshiring.',
				'danger'
			)
			return
		}

		const mask = IMask(phoneInput, {
			mask: '+998-(##)-###-##-##',
			lazy: false,
			placeholderChar: '#',
			overwrite: true,
			autofix: true,
			blocks: {
				'#': {
					mask: IMask.MaskedRange,
					from: 0,
					to: 9,
				},
			},
		})

		phoneInput.removeAttribute('readonly')
		phoneInput.removeAttribute('disabled')

		document.getElementById('languageSelect').addEventListener('change', () => {
			phoneInput.placeholder = getLangText('enterPhone')
		})
	} else {
		console.error('phoneInput elementi topilmadi!')
	}

	// Ism va familya uchun faqat harflar va probelga ruxsat berish
	if (usernameInput) {
		usernameInput.addEventListener('input', () => {
			const validInput = usernameInput.value.replace(/[^a-zA-Zа-яА-Я\s]/g, '')
			if (usernameInput.value !== validInput) {
				usernameInput.value = validInput
				showToast(getLangText('invalidName'), 'warning')
			}
		})
	} else {
		console.error('usernameInput elementi topilmadi!')
	}

	// "Testni boshlash" tugmasi uchun voqea tinglovchisi
	if (startButton) {
		startButton.addEventListener('click', () => {
			startQuiz()
		})
		const startText = document.getElementById('startButton')
		if (startText) {
			startText.innerText = getLangText('start')
		}
	} else {
		console.error('startQuizButton elementi topilmadi!')
	}
})

document.getElementById('languageSelect').addEventListener('change', () => {
	language = document.getElementById('languageSelect').value
	document.getElementById('enterNameText').innerText = getLangText('enterName')
	document.getElementById('startButton').innerText = getLangText('start')
	document.getElementById('prepTitle').innerText = getLangText('prepTitle')
	document.getElementById('totalTimeLabel').innerText = getLangText('totalTime')
	document.getElementById('nextBtnText').innerText = getLangText('next')
	document.getElementById('prevBtnText').innerText = getLangText('prev')
	document.getElementById('questionCountInput').placeholder =
		getLangText('enterCount')
	document.getElementById('usernameInput').placeholder =
		getLangText('enterYourName')
	const topicSelect = document.getElementById('topicSelect')
	topicSelect.options[0].text = getLangText('selectTopic')
	topicSelect.options[1].text = getLangText('topicHTML')
	topicSelect.options[2].text = getLangText('topicCSS')
	topicSelect.options[3].text = getLangText('topicJS')
	const prepCountdownValue =
		document.getElementById('prepCountdown')?.innerText || 10
	const prepTimerSuffix = document.getElementById('prepTimerSuffix')
	if (prepTimerSuffix) {
		prepTimerSuffix.textContent = getLangText('questionTimerSuffix')
	}
	document.getElementById('prepText').innerText = getLangText(
		'prepTimer',
		prepCountdownValue
	)
	const totalTimerSuffix = document.getElementById('totalTimerSuffix')
	if (totalTimerSuffix) {
		totalTimerSuffix.textContent = ''
	}
})

async function startQuiz() {
	username = document.getElementById('usernameInput')?.value.trim() || ''
	phoneNumber = document.getElementById('phoneInput')?.value.trim() || ''
	selectedTopic = document.getElementById('topicSelect')?.value || ''
	language = document.getElementById('languageSelect')?.value || 'uz'
	const questionCountInput = document.getElementById('questionCountInput')
	const questionCount = questionCountInput
		? parseInt(questionCountInput.value)
		: 0

	// Ism va familyani tekshirish: faqat harflar va probel, minimal 10 belgi
	const nameRegex = /^[a-zA-Zа-яА-Я\s]+$/
	if (!nameRegex.test(username) || username.length < 10) {
		showToast(getLangText('invalidName'), 'warning')
		return
	}

	const nameParts = username.split(' ').filter(part => part.length > 0)
	if (nameParts.length < 2) {
		showToast(getLangText('invalidName'), 'warning')
		return
	}

	const phoneRegex = /^\+998-\(\d{2}\)-\d{3}-\d{2}-\d{2}$/
	if (!phoneRegex.test(phoneNumber)) {
		showToast(getLangText('invalidPhone'), 'warning')
		return
	}

	if (!selectedTopic) {
		showToast(getLangText('invalidTopic'), 'warning')
		return
	}

	if (isNaN(questionCount) || questionCount <= 0) {
		showToast(getLangText('invalidCount'), 'warning')
		return
	}

	try {
		const res = await fetch('/questions.json')
		if (!res.ok) {
			throw new Error(
				`Failed to fetch questions.json: ${res.status} ${res.statusText}`
			)
		}
		const data = await res.json()
		allQuestions = data.filter(q => q.topic === selectedTopic)

		if (allQuestions.length === 0) {
			showToast(getLangText('notFound'), 'danger')
			return
		}
		if (questionCount > allQuestions.length) {
			showToast(getLangText('exceeds', allQuestions.length), 'warning')
			return
		}

		shuffledQuestions = allQuestions
			.sort(() => 0.5 - Math.random())
			.slice(0, questionCount)
		userAnswers = new Array(shuffledQuestions.length).fill(null)
		currentQuestion = 0
		totalTime = shuffledQuestions.length * questionTime
		initialTotalTime = totalTime

		const usernameForm = document.getElementById('usernameForm')
		const prepOverlay = document.getElementById('prepOverlay')
		const quizSection = document.getElementById('quizSection')
		if (usernameForm) usernameForm.classList.add('d-none')
		if (prepOverlay) prepOverlay.classList.remove('d-none')
		if (quizSection) quizSection.classList.remove('d-none')
		startPreparation()
	} catch (err) {
		console.error('Error in startQuiz:', err)
		showToast(
			'Savollarni yuklab bo‘lmadi! Fayllar to‘g‘ri joylashganligini tekshiring.',
			'danger'
		)
	}
}

function startPreparation() {
	let prepTime = 10
	const prepCountdown = document.getElementById('prepCountdown')
	const prepText = document.getElementById('prepText')
	const prepTimerSuffix = document.getElementById('prepTimerSuffix')

	if (!prepCountdown || !prepText || !prepTimerSuffix) {
		console.error(
			'prepCountdown, prepText yoki prepTimerSuffix elementi topilmadi!'
		)
		return
	}

	prepCountdown.textContent = prepTime
	prepTimerSuffix.textContent = getLangText('questionTimerSuffix')

	const interval = setInterval(() => {
		prepTime--
		prepCountdown.textContent = prepTime

		if (prepTime <= 0) {
			clearInterval(interval)
			const prepOverlay = document.getElementById('prepOverlay')
			const quizSection = document.getElementById('quizSection')
			if (prepOverlay) prepOverlay.classList.add('d-none')
			if (quizSection) {
				quizSection.style.pointerEvents = 'auto'
				quizSection.style.opacity = '1'
			}
			startTimers()
			loadQuestion(currentQuestion)
			startQuestionTimer()
		}
	}, 1000)
}

function startTimers() {
	totalTimerDisplay.textContent = formatTime(totalTime)
	const totalTimerSuffix = document.getElementById('totalTimerSuffix')
	if (totalTimerSuffix) {
		totalTimerSuffix.textContent = ''
	}

	document.title = `Quiz Test - ${formatTime(totalTime)}`

	totalInterval = setInterval(() => {
		totalTime--
		totalTimerDisplay.textContent = formatTime(totalTime)
		document.title = `Quiz Test - ${formatTime(totalTime)}`

		if (totalTime === 20 && !warningShown) {
			showToast(getLangText('timeWarning'), 'warning')
			warningShown = true
		}

		if (totalTime <= 0) {
			clearInterval(totalInterval)
			clearInterval(questionInterval)
			showResult(true)
		}
	}, 1000)
}

function startQuestionTimer() {
	clearInterval(questionInterval)
	let timeLeft = questionTime
	const questionTimer = document.getElementById('questionTimer')

	if (!questionTimer) {
		console.error('questionTimer elementi topilmadi!')
		return
	}

	questionTimer.textContent = timeLeft

	questionInterval = setInterval(() => {
		timeLeft--
		questionTimer.textContent = timeLeft
		if (timeLeft <= 0) {
			clearInterval(questionInterval)
			autoNext()
		}
	}, 1000)
}

function autoNext() {
	if (currentQuestion < shuffledQuestions.length - 1) {
		currentQuestion++
		loadQuestion(currentQuestion)
	} else {
		showResult(false)
	}
}

function loadQuestion(index) {
	const q = shuffledQuestions[index]
	const options = q.options[language]
	const questionText = q.question[language]

	quizContainer.innerHTML = `
        <div class="question">${index + 1}. ${questionText}</div>
        ${options
					.map(
						(opt, i) => `
            <div class="form-check option">
                <input class="form-check-input" type="radio" name="question" id="opt${i}" value="${i}" ${
							userAnswers[index] === i ? 'checked' : ''
						}>
                <label class="form-check-label" for="opt${i}">${String.fromCharCode(
							65 + i
						)}) ${opt}</label>
            </div>
        `
					)
					.join('')}
        <div class="question-timer-box">
            <i class="bi bi-hourglass-split text-warning me-2"></i>
            ${getLangText(
							'timeLeft'
						)}: <span id="questionTimer">${questionTime}</span> ${getLangText(
		'questionTimerSuffix'
	)}
        </div>
    `

	prevBtn.disabled = index === 0
	nextBtn.innerHTML =
		index === shuffledQuestions.length - 1
			? `<i class="bi bi-flag-fill me-1"></i>${getLangText('finish')}`
			: `${getLangText(
					'next'
			  )} <i class="bi bi-arrow-right-circle-fill ms-1"></i>`

	updateProgress()
	startQuestionTimer()
	window.scrollTo({ top: 0, behavior: 'smooth' })
}

function updateProgress() {
	const answered = userAnswers.filter(v => v !== null).length
	const percent = Math.round((answered / shuffledQuestions.length) * 100)
	progressBar.style.width = `${percent}%`
	progressBar.innerText = `${percent}%`
}

function showResult(timeUp) {
	clearInterval(questionInterval)
	if (!timeUp) {
		clearInterval(totalInterval)
	}

	let score = 0
	quizContainer.innerHTML = shuffledQuestions
		.map((q, i) => {
			const userAnswer = userAnswers[i]
			const isCorrect = userAnswer === q.correct
			if (isCorrect) score++
			return `
            <div class="mb-3">
                <strong>${i + 1}. ${q.question[language]}</strong><br />
                ${getLangText('yourAnswer')}: <span class="${
				isCorrect ? 'correct' : 'wrong'
			}">
                ${
									q.options[language][userAnswer] || getLangText('noAnswer')
								}</span><br />
                ${getLangText('correctAnswer')}: <span class="correct">${
				q.options[language][q.correct]
			}</span>
            </div>`
		})
		.join('')

	resultContainer.innerHTML = `
        <h5><i class="bi bi-patch-check-fill text-success me-2"></i><strong>${username}</strong>, ${getLangText(
		'resultTitle'
	)}</h5>
        ${
					timeUp
						? `<span class='text-danger'><i class='bi bi-alarm-fill me-1'></i>${getLangText(
								'timeUp'
						  )}</span><br>`
						: ''
				}
        ${getLangText('resultText')} <strong>${score}/${
		shuffledQuestions.length
	}</strong> <i class="bi bi-trophy-fill text-warning ms-2"></i><br>
        <button class="btn btn-outline-danger mt-3" onclick="downloadPDF()">
            <i class="bi bi-file-earmark-arrow-down-fill me-1"></i>${getLangText(
							'download'
						)}
        </button>
    `

	nextBtn.style.display = 'none'
	prevBtn.style.display = 'none'
	progressBar.style.width = '100%'
	progressBar.innerText = '100%'
	totalTimerDisplay.textContent = '00:00'
	document.title = `Quiz Test - ${getLangText('resultTitle')}`
}

function downloadPDF() {
	const now = new Date()
	const formattedDate = now.toLocaleDateString(
		language + '-' + language.toUpperCase()
	)
	const formattedTime = now.toLocaleTimeString(
		language + '-' + language.toUpperCase()
	)

	const score = userAnswers.filter(
		(ans, i) => ans === shuffledQuestions[i].correct
	).length
	const languageName = getLangText(`lang_${language}`)
	const developerLabel =
		language === 'uz'
			? 'Dasturchi'
			: language === 'en'
			? 'Developer'
			: 'Разработчик'
	const timeSpent = initialTotalTime - totalTime

	const minutes = Math.floor(timeSpent / 60)
	const seconds = timeSpent % 60
	const formattedTimeSpent =
		minutes > 0
			? `${minutes} ${getLangText('minuteLabel')} ${seconds} ${getLangText(
					'secondLabel'
			  )}`
			: `${seconds} ${getLangText('secondLabel')}`

	const questionsPerPage = 20
	const tableChunks = []
	for (let i = 0; i < shuffledQuestions.length; i += questionsPerPage) {
		const chunk = shuffledQuestions.slice(i, i + questionsPerPage)
		const chunkRows = chunk
			.map((q, index) => {
				const globalIndex = i + index
				const userAnswer = userAnswers[globalIndex]
				const isCorrect = userAnswer === q.correct
				const questionText = q.question[language] || 'Savol mavjud emas'
				const userAnswerText =
					q.options[language][userAnswer] || getLangText('noAnswer')
				const correctAnswerText =
					q.options[language][q.correct] || 'Javob mavjud emas'

				return `
                <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px; word-wrap: break-word; max-width: 300px; font-size: 12px; line-height: 1.5;">${
											globalIndex + 1
										}. ${questionText}</td>
                    <td style="padding: 10px; color: ${
											isCorrect ? '#2ecc71' : '#e74c3c'
										}; word-wrap: break-word; max-width: 200px; font-size: 12px; font-weight: 500;">${userAnswerText}</td>
                    <td style="padding: 10px; color: #2ecc71; word-wrap: break-word; max-width: 200px; font-size: 12px; font-weight: 500;">${correctAnswerText}</td>
                </tr>
            `
			})
			.join('')
		tableChunks.push(chunkRows)
	}

	const tableSections = tableChunks
		.map(
			(chunkRows, index) => `
        <div class="table-section" style="background: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-bottom: 25px; page-break-before: ${
					index === 0 ? 'avoid' : 'always'
				};">
            <h3 style="font-size: 18px; color: #34495e; margin-bottom: 15px; border-bottom: 2px solid #3498db; padding-bottom: 8px; font-weight: 600;">
                ${
									language === 'uz'
										? 'Savollar va Javoblar'
										: language === 'en'
										? 'Questions and Answers'
										: 'Вопросы и Ответы'
								} 
                (${index * questionsPerPage + 1}-${Math.min(
				(index + 1) * questionsPerPage,
				shuffledQuestions.length
			)})
            </h3>
            <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
                <thead>
                    <tr style="background: #3498db; color: #ffffff; font-weight: 600;">
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #2980b9;">
                            ${
															language === 'uz'
																? 'Savol'
																: language === 'en'
																? 'Question'
																: 'Вопрос'
														}
                        </th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #2980b9;">
                            ${getLangText('yourAnswer')}
                        </th>
                        <th style="padding: 12px; text-align: left; border-bottom: 2px solid #2980b9;">
                            ${getLangText('correctAnswer')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    ${chunkRows}
                </tbody>
            </table>
        </div>
    `
		)
		.join('')

	const element = document.createElement('div')
	element.innerHTML = `
        <div style="font-family: 'Poppins', sans-serif; font-size: 12px; color: #2c3e50; padding: 20px; background: linear-gradient(135deg, #ecf0f1 0%, #dfe4ea 100%); max-width: 900px; margin: 0 auto;">
            <!-- Header -->
            <div style="background: linear-gradient(90deg, #3498db 0%, #2980b9 100%); color: #ffffff; padding: 20px; border-radius: 12px; text-align: center; margin-bottom: 25px; box-shadow: 0 6px 14px rgba(0,0,0,0.15); position: relative; page-break-after: avoid;">
                <h2 style="margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">
                    <span style="font-size: 28px; margin-right: 10px;">📋</span> ${getLangText(
											'downloadTitle'
										)}
                </h2>
                <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">QuizTest - Bilimlaringizni sinang!</p>
            </div>

            <!-- User Info Section -->
            <div style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 25px; page-break-inside: avoid;">
                <div style="flex: 1; min-width: 280px; background: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-left: 4px solid #3498db;">
                    <p style="margin: 8px 0; font-size: 14px; font-weight: 500;"><i class="bi bi-person-circle me-2" style="color: #3498db;"></i><strong style="color: #34495e;">${getLangText(
											'name'
										)}</strong> ${username}</p>
                    <p style="margin: 8px 0; font-size: 14px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><i class="bi bi-telephone-fill me-2" style="color: #3498db;"></i><strong style="color: #34495e;">${getLangText(
											'phone'
										)}</strong> ${phoneNumber}</p>
                    <p style="margin: 8px 0; font-size: 14px; font-weight: 500;"><i class="bi bi-book-fill me-2" style="color: #3498db;"></i><strong style="color: #34495e;">${getLangText(
											'topic'
										)}</strong> ${selectedTopic}</p>
                </div>
                <div style="flex: 1; min-width: 220px; background: #ffffff; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); border-left: 4px solid #3498db;">
                    <p style="margin: 8px 0; font-size: 14px; font-weight: 500;"><i class="bi bi-globe me-2" style="color: #3498db;"></i><strong style="color: #34495e;">${getLangText(
											'language'
										)}</strong> ${languageName}</p>
                    <p style="margin: 8px 0; font-size: 14px; font-weight: 500;"><i class="bi bi-calendar-date me-2" style="color: #3498db;"></i><strong style="color: #34495e;">${getLangText(
											'date'
										)}</strong> ${formattedDate}</p>
                    <p style="margin: 8px 0; font-size: 14px; font-weight: 500;"><i class="bi bi-clock-fill me-2" style="color: #3498db;"></i><strong style="color: #34495e;">${getLangText(
											'time'
										)}</strong> ${formattedTime}</p>
                </div>
                <div style="flex: 1; min-width: 180px; background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; border: 2px solid #3498db;">
                    <p style="margin: 8px 0; font-size: 18px; font-weight: 700; color: #2ecc71;"><i class="bi bi-trophy-fill me-2" style="color: #f1c40f;"></i><strong>${getLangText(
											'score'
										)}</strong> ${score} / ${shuffledQuestions.length}</p>
                    <p style="margin: 8px 0; font-size: 16px; font-weight: 600; color: #3498db;"><i class="bi bi-hourglass-split me-2" style="color: #3498db;"></i><strong>${getLangText(
											'timeSpent'
										)}</strong> ${formattedTimeSpent}</p>
                    <p style="margin: 8px 0; font-size: 12px; color: #7f8c8d;"><a href="https://quiztest-uz.vercel.app" style="text-decoration: none; color: #3498db; font-weight: 500;">quiztest-uz.vercel.app</a></p>
                </div>
            </div>

            <!-- Questions and Answers Sections -->
            ${tableSections}

            <!-- Footer -->
            <div style="text-align: center; font-size: 11px; color: #7f8c8d; margin-top: 30px; border-top: 2px solid #3498db; padding-top: 15px; page-break-before: avoid;">
                <p style="margin: 0; font-weight: 500;">© ${new Date().getFullYear()} <a href="https://quiztest-uz.vercel.app" style="text-decoration: none; color: #3498db; font-weight: 600;">QuizTest</a> | ${formattedDate}</p>
                <div style="display: inline-block; background: #ffffff; padding: 15px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin-top: 15px;">
                    <p style="margin: 0; font-size: 12px; font-weight: 600; color: #34495e;">
                        <strong>${developerLabel}: </strong><strong style="color: #3498db;">Akmaljon Yusupov</strong>
                        <span style="margin-left: 15px;">
                            <i class="bi bi-telephone-fill" style="color: #3498db; font-size: 13px; margin-right: 5px;"></i>
                            <span style="color: #34495e;">+998-(88)-570-02-09</span>
                        </span>
                        <span style="margin-left: 15px;">
                            <i class="bi bi-telegram" style="color: #0088cc; font-size: 13px; margin-right: 5px;"></i>
                            <a href="https://t.me/AkmaljonYusupov" style="color: #0088cc; text-decoration: none;">@AkmaljonYusupov</a>
                        </span>
                        <span style="margin-left: 15px;">
                            <i class="bi bi-telegram" style="color: #0088cc; font-size: 13px; margin-right: 5px;"></i>
                            <a href="https://t.me/coder_ac" style="color: #0088cc; text-decoration: none;">@coder_ac</a>
                        </span>
                        <span style="margin-left: 15px;">
                            <i class="bi bi-instagram" style="color: #e91e63; font-size: 13px; margin-right: 5px;"></i>
                            <a href="https://instagram.com/coder.ac" style="color: #e91e63; text-decoration: none;">@coder.ac</a>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    `

	html2pdf()
		.set({
			margin: [15, 15, 15, 15],
			filename: `${username}_${selectedTopic}_quiz_result.pdf`,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: {
				scale: 2,
				useCORS: true,
				logging: true,
				scrollY: 0,
				windowHeight: 842,
			},
			jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
			pagebreak: {
				mode: ['css', 'legacy'],
				avoid: ['tr', 'div'],
				before: '.break-before',
				after: '.break-after',
			},
		})
		.from(element)
		.save()
		.catch(err => {
			console.error('PDF generatsiyasida xato:', err)
			showToast('PDFni yuklashda xato yuz berdi!', 'danger')
		})
}

nextBtn.addEventListener('click', () => {
	const selected = document.querySelector('input[name="question"]:checked')
	if (!selected) {
		showToast(getLangText('noSelection'), 'danger')
		return
	}
	userAnswers[currentQuestion] = parseInt(selected.value)
	clearInterval(questionInterval)

	if (currentQuestion < shuffledQuestions.length - 1) {
		currentQuestion++
		loadQuestion(currentQuestion)
	} else {
		showResult(false)
	}
})

prevBtn.addEventListener('click', () => {
	if (currentQuestion > 0) {
		currentQuestion--
		loadQuestion(currentQuestion)
	}
})
