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
let questionInterval, totalInterval

const quizContainer = document.getElementById('quiz')
const resultContainer = document.getElementById('result')
const nextBtn = document.getElementById('nextBtn')
const prevBtn = document.getElementById('prevBtn')
const progressBar = document.getElementById('progressBar')
const totalTimerDisplay = document.getElementById('totalTimer')

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
			'Iltimos, ism va familyani to‘liq kiriting (masalan: Akmaljon Yusupov)!',
		invalidPhone: 'Iltimos, to‘liq 9 ta raqam kiriting: +998-(##)-###-##-##',
		invalidTopic: 'Iltimos, mavzuni tanlang!',
		invalidCount:
			'Iltimos, savollar sonini to‘g‘ri kiriting (1 dan 1000 gacha)!',
		notFound: 'Tanlangan mavzu bo‘yicha savollar topilmadi!',
		exceeds: count => `Tanlangan mavzuda faqat ${count} ta savol mavjud!`,
		downloadTitle: '📋 Quiz Natijasi',
		name: '👤 Ism:',
		phone: '📞 Telefon:',
		topic: '📘 Mavzu:',
		language: '🌐 Til:',
		lang_uz: 'O‘zbekcha',
		lang_en: 'Inglizcha',
		lang_ru: 'Ruscha',
		date: '📅 Sana:',
		time: '⏰ Vaqt:',
		score: '🏆 Ball:',
		footerText: 'Natijalarni onlayn ko‘rish uchun QR kodni skanerlang',
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
			'Please enter both first and last name (e.g., Akmaljon Yusupov)!',
		invalidPhone: 'Please enter all 9 digits: +998-(##)-###-##-##',
		invalidTopic: 'Please select a topic!',
		invalidCount: 'Please enter a valid number of questions (1 to 1000)!',
		notFound: 'No questions found for the selected topic!',
		exceeds: count =>
			`Only ${count} questions available for the selected topic!`,
		downloadTitle: '📋 Quiz Result',
		name: '👤 Name:',
		phone: '📞 Phone:',
		topic: '📘 Topic:',
		language: '🌐 Language:',
		lang_uz: 'Uzbek',
		lang_en: 'English',
		lang_ru: 'Russian',
		date: '📅 Date:',
		time: '⏰ Time:',
		score: '🏆 Score:',
		footerText: 'Scan the QR code to view results online',
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
			'Пожалуйста, введите имя и фамилию полностью (например, Акмалжон Юсупов)!',
		invalidPhone: 'Пожалуйста, введите все 9 цифр: +998-(##)-###-##-##',
		invalidTopic: 'Пожалуйста, выберите тему!',
		invalidCount:
			'Пожалуйста, введите правильное количество вопросов (от 1 до 1000)!',
		notFound: 'Вопросы по выбранной теме не найдены!',
		exceeds: count => `Доступно только ${count} вопросов по выбранной теме!`,
		downloadTitle: '📋 Результат теста',
		name: '👤 Имя:',
		phone: '📞 Телефон:',
		topic: '📘 Тема:',
		language: '🌐 Язык:',
		lang_uz: 'Узбекский',
		lang_en: 'Английский',
		lang_ru: 'Русский',
		date: '📅 Дата:',
		time: '⏰ Время:',
		score: '🏆 Балл:',
		footerText: 'Отсканируйте QR-код, чтобы просмотреть результаты онлайн',
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

// Apply phone number input mask
document.addEventListener('DOMContentLoaded', () => {
	const phoneInput = document.getElementById('phoneInput')
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

		// Ensure input is enabled and focusable
		phoneInput.removeAttribute('readonly')
		phoneInput.removeAttribute('disabled')

		// Update placeholder on language change
		document.getElementById('languageSelect').addEventListener('change', () => {
			phoneInput.placeholder = getLangText('enterPhone')
		})
	} else {
		console.error('phoneInput elementi topilmadi!')
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
		totalTimerSuffix.textContent =
			getLangText('questionTimerSuffix') === 'seconds'
				? 'seconds'
				: getLangText('questionTimerSuffix')
	}
})

// Start Quiz
async function startQuiz() {
	username = document.getElementById('usernameInput')?.value.trim() || ''
	phoneNumber = document.getElementById('phoneInput')?.value.trim() || ''
	selectedTopic = document.getElementById('topicSelect')?.value || ''
	language = document.getElementById('languageSelect')?.value || 'uz'
	const questionCountInput = document.getElementById('questionCountInput')
	const questionCount = questionCountInput
		? parseInt(questionCountInput.value)
		: 0

	// Validate username (must contain first and last name)
	const nameParts = username.split(' ').filter(part => part.length > 0)
	if (nameParts.length < 2) {
		showToast(getLangText('invalidName'), 'warning')
		return
	}

	// Validate phone number
	const phoneRegex = /^\+998-\(\d{2}\)-\d{3}-\d{2}-\d{2}$/
	if (!phoneRegex.test(phoneNumber)) {
		showToast(getLangText('invalidPhone'), 'warning')
		return
	}

	// Validate topic
	if (!selectedTopic) {
		showToast(getLangText('invalidTopic'), 'warning')
		return
	}

	// Validate question count
	if (isNaN(questionCount) || questionCount <= 0 || questionCount > 1000) {
		showToast(getLangText('invalidCount'), 'warning')
		return
	}

	try {
		const res = await fetch('./questions.json')
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

		const usernameForm = document.getElementById('usernameForm')
		const prepOverlay = document.getElementById('prepOverlay')
		const quizSection = document.getElementById('quizSection')
		if (usernameForm) usernameForm.classList.add('d-none')
		if (prepOverlay) prepOverlay.classList.remove('d-none')
		if (quizSection) quizSection.classList.remove('d-none')
		startPreparation()
	} catch (err) {
		console.error(err)
		showToast('Savollarni yuklab bo‘lmadi!', 'danger')
	}
}

// Preparation
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

// Start Timers
function startTimers() {
	totalTimerDisplay.textContent = totalTime
	const totalTimerSuffix = document.getElementById('totalTimerSuffix')
	if (totalTimerSuffix) {
		totalTimerSuffix.textContent =
			getLangText('questionTimerSuffix') === 'seconds'
				? 'seconds'
				: getLangText('questionTimerSuffix')
	}

	totalInterval = setInterval(() => {
		totalTime--
		totalTimerDisplay.textContent = totalTime
		if (totalTime <= 0) {
			clearInterval(totalInterval)
			clearInterval(questionInterval)
			showResult(true)
		}
	}, 1000)
}

// Question Timer
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

// Auto Next Question
function autoNext() {
	if (currentQuestion < shuffledQuestions.length - 1) {
		currentQuestion++
		loadQuestion(currentQuestion)
	} else {
		showResult(false)
	}
}

// Load Question
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

// Update Progress
function updateProgress() {
	const answered = userAnswers.filter(v => v !== null).length
	const percent = Math.round((answered / shuffledQuestions.length) * 100)
	progressBar.style.width = `${percent}%`
	progressBar.innerText = `${percent}%`
}

// Show Result
function showResult(timeUp) {
	clearInterval(questionInterval)
	clearInterval(totalInterval)

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
	totalTimerDisplay.textContent = '0'
}

// Download PDF
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

	// Generate QR Code
	let qrCodeDataUrl = ''
	if (typeof QRCode !== 'undefined') {
		const qrCanvas = document.createElement('canvas')
		QRCode.toCanvas(
			qrCanvas,
			'http://127.0.0.1:5500/results.html',
			{
				width: 80,
				margin: 1,
				errorCorrectionLevel: 'H',
			},
			error => {
				if (error) console.error('QR Code generation failed:', error)
			}
		)
		qrCodeDataUrl = qrCanvas.toDataURL('image/png')
	} else {
		console.error('QRCode library not loaded')
	}

	const element = document.createElement('div')
	element.innerHTML = `
        <div style="font-family: Helvetica, Arial, sans-serif; font-size: 11px; color: #333; padding: 8px; background: #f8f9fa;">
            <div style="text-align: center; background: linear-gradient(to right, #007bff, #0056b3); color: white; padding: 8px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 8px;">
                <h2 style="margin: 0; font-size: 16px;">
                    <span style="font-size: 18px;">📋</span> ${getLangText(
											'downloadTitle'
										)}
                </h2>
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 8px; border: 1px solid #ddd; padding: 8px; border-radius: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
                <div style="flex: 1; min-width: 120px;">
                    <p style="margin: 3px 0;"><strong>${getLangText(
											'name'
										)}</strong> ${username}</p>
                    <p style="margin: 3px 0;"><strong>${getLangText(
											'phone'
										)}</strong> ${phoneNumber}</p>
                    <p style="margin: 3px 0;"><strong>${getLangText(
											'topic'
										)}</strong> ${selectedTopic}</p>
                </div>
                <div style="flex: 1; min-width: 120px;">
                    <p style="margin: 3px 0;"><strong>${getLangText(
											'language'
										)}</strong> ${languageName}</p>
                    <p style="margin: 3px 0;"><strong>${getLangText(
											'date'
										)}</strong> ${formattedDate}</p>
                    <p style="margin: 3px 0;"><strong>${getLangText(
											'time'
										)}</strong> ${formattedTime}</p>
                </div>
                <div style="flex: 1; min-width: 120px; text-align: center;">
                    <p style="margin: 3px 0;"><strong>${getLangText(
											'score'
										)}</strong> ${score} / ${shuffledQuestions.length}</p>
                    ${
											qrCodeDataUrl
												? `<img src="${qrCodeDataUrl}" style="width: 60px; height: 60px; margin-top: 5px;" />`
												: '<p style="color: #dc3545; font-size: 10px;">QR Code not available</p>'
										}
                </div>
            </div>
            <hr style="border: 0; border-top: 1px solid #ddd; margin: 8px 0;" />
            <div style="font-size: 10px;">
                ${quizContainer.innerHTML
									.replace(/class="[^"]*"/g, '')
									.replace(/<span[^>]*>/g, '<span style="color: #28a745;">')
									.replace(/wrong/g, 'color: #dc3545;')}
            </div>
            <div style="text-align: center; margin-top: 8px; font-size: 9px; color: #666;">
                <p>${getLangText('footerText')}</p>
            </div>
        </div>
    `

	html2pdf()
		.set({
			margin: [3, 3, 3, 3], // Further reduced margins
			filename: `${username}_${selectedTopic}_quiz_result.pdf`,
			image: { type: 'jpeg', quality: 0.98 },
			html2canvas: { scale: 3 }, // Increased scale for sharper QR code
			jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
		})
		.from(element)
		.save()
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

// Start button hodisasi
document.addEventListener('DOMContentLoaded', function () {
	const startButton = document.getElementById('startButton')
	if (startButton) {
		startButton.removeEventListener('click', startQuiz)
		startButton.addEventListener('click', startQuiz, { once: true })
		startButton.innerText = getLangText('start')
	} else {
		console.error('startButton elementi topilmadi!')
	}
})
