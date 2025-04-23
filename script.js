// Global o'zgaruvchilar
let allQuestions = [] // Barcha savollar ro'yxati (questions.json dan yuklanadi)
let shuffledQuestions = [] // Aralashtirilgan savollar ro'yxati (tanlangan savollar soni bo'yicha)
let currentQuestion = 0 // Joriy savol indeksi
let userAnswers = [] // Foydalanuvchi javoblari (indekslar sifatida saqlanadi)
let username = '' // Foydalanuvchi ismi
let phoneNumber = '' // Foydalanuvchi telefon raqami
let selectedTopic = '' // Tanlangan mavzu
let language = 'uz' // Tanlangan til (standart: o'zbekcha)
const questionTime = 25 // Har bir savol uchun berilgan vaqt (soniyalarda)
let totalTime = 0 // Umumiy test vaqti (soniyalarda)
let initialTotalTime = 0 // Dastlabki umumiy vaqt (qayta hisoblash uchun)
let questionInterval, totalInterval // Savol va umumiy vaqt taymerlari uchun interval identifikatorlari
let warningShown = false // Vaqt tugashi haqida ogohlantirish ko'rsatilganligini bildiruvchi flag
let isQuizActive = false // Test faol holatda ekanligini bildiruvchi flag

// DOM elementlari bilan bog'lanish
const quizContainer = document.getElementById('quiz') // Savollar ko'rsatiladigan konteyner
const resultContainer = document.getElementById('result') // Natijalar ko'rsatiladigan konteyner
const nextBtn = document.getElementById('nextBtn') // "Keyingi" tugmasi
const prevBtn = document.getElementById('prevBtn') // "Ortga" tugmasi
const progressBar = document.getElementById('progressBar') // Progress bar elementi
const totalTimerDisplay = document.getElementById('totalTimer') // Umumiy vaqtni ko'rsatuvchi element

/**
 * Massivni tasodifiy tartibda aralashtirish uchun Fisher-Yates algoritmi
 * @param {Array} array - Aralashtiriladigan massiv
 * @returns {Array} - Aralashtirilgan yangi massiv
 */
function shuffleArray(array) {
	const newArray = [...array] // Asl massivning nusxasini yaratish
	for (let i = newArray.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1)) // Tasodifiy indeks tanlash
		;[newArray[i], newArray[j]] = [newArray[j], newArray[i]] // Elementlarni almashish
	}
	return newArray
}

/**
 * Soniyalarni HH:MM:SS formatida vaqt sifatida formatlash
 * @param {number} seconds - Formatlanadigan soniyalar
 * @returns {string} - HH:MM:SS formatidagi vaqt (masalan: "01:15:00" yoki "00:45:00")
 */
function formatTime(seconds) {
	const hours = Math.floor(seconds / 3600) // Soatlarni hisoblash
	const minutes = Math.floor((seconds % 3600) / 60) // Daqiqalarni hisoblash
	const secs = seconds % 60 // Qolgan soniyalarni hisoblash
	return `${hours.toString().padStart(2, '0')}:${minutes
		.toString()
		.padStart(2, '0')}:${secs.toString().padStart(2, '0')}` // Formatlangan vaqtni qaytarish
}

/**
 * Joriy vaqtni HH:MM:SS AM/PM formatida formatlash
 * @returns {string} - HH:MM:SS AM/PM formatidagi vaqt (masalan: "02:30:45 PM")
 */
function formatClock() {
	const now = new Date() // Joriy vaqtni olish
	let hours = now.getHours() // Soatlarni olish
	const minutes = now.getMinutes().toString().padStart(2, '0') // Daqiqalarni formatlash
	const seconds = now.getSeconds().toString().padStart(2, '0') // Soniyalarni formatlash
	const ampm = hours >= 12 ? 'PM' : 'AM' // AM/PM ni aniqlash
	hours = hours % 12 || 12 // 24 soat formatini 12 soat formatiga o'tkazish
	hours = hours.toString().padStart(2, '0') // Soatlarni formatlash
	return `${hours}:${minutes}:${seconds} ${ampm}` // Formatlangan vaqtni qaytarish
}

// Til ma'lumotlari ob'ekti (har bir til uchun matnlar)
const langData = {
	uz: {
		enterName: 'Ismingizni va familyangizni kiriting',
		enterPhone: 'Telefon raqamingizni kiriting: +998-(##)-###-##-##',
		start: 'Testni Boshlash',
		selectTopic: '-- Mavzuni tanlang --',
		topicHTML: 'HTML',
		topicCSS: 'CSS',
		topicJS: 'JavaScript',
		topicEnglish: 'Ingliz tili',
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
		yourAnswer: 'Sizning javobingiz',
		correctAnswer: 'To‘g‘ri javob',
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
		downloadTitle: 'Test Natijasi',
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
		contactButton: 'Bog‘lanish',
		contactNameLabel: 'Ism va familya:',
		contactPhoneLabel: 'Telefon:',
		contactTelegramLabel: 'Telegram:',
		contactTelegramChannelLabel: 'Telegram kanal:',
		contactInstagramLabel: 'Instagram:',
		contactTitle: '📬 Aloqa uchun',
		contactMessage:
			'Dasturchi bilan bog‘lanish uchun yuqoridagi <span class="custom-highlight">Telegram</span>, <span class="custom-highlight">Instagram</span> va boshqa ijtimoiy tarmoqlardagi rasmiy sahifalar orqali aloqaga chiqishingiz mumkin.',
		contactChannelMessage:
			'Shuningdek, <span class="custom-highlight">Telegram kanalimiz</span> orqali portfoliodagi loyihalarni kuzatib borishingiz va yangiliklardan muntazam xabardor bo‘lishingiz mumkin.',
		telegramSent: 'Natija Telegram botga yuborildi!',
		telegramError:
			'Natijani Telegram botga yuborishda xato yuz berdi! Iltimos, tarmoq ulanishini tekshiring yoki keyinroq qayta urinib ko‘ring.',
		leaveWarning:
			'Test davom etmoqda! Sahifani yangilasangiz, natijangiz yo‘qotiladi. Davom etmoqchimisiz?',
		refreshWarning: 'Test davom etmoqda! Sahifani yangilash mumkin emas.',
	},
	en: {
		enterName: 'Enter your first and last name',
		enterPhone: 'Enter your phone number: +998-(##)-###-##-##',
		start: 'Start the Test',
		selectTopic: '-- Select topic --',
		topicHTML: 'HTML',
		topicCSS: 'CSS',
		topicJS: 'JavaScript',
		topicEnglish: 'English',
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
		yourAnswer: 'Your answer',
		correctAnswer: 'Correct answer',
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
		contactButton: 'Contact',
		contactNameLabel: 'Name:',
		contactPhoneLabel: 'Phone:',
		contactTelegramLabel: 'Telegram:',
		contactTelegramChannelLabel: 'Telegram Channel:',
		contactInstagramLabel: 'Instagram:',
		contactTitle: '📬 Contact Us',
		contactMessage:
			'You can reach the developer through the official pages on <span class="custom-highlight">Telegram</span>, <span class="custom-highlight">Instagram</span>, and other social media platforms listed above.',
		contactChannelMessage:
			'Additionally, you can follow our projects and stay updated with the latest news through our <span class="custom-highlight">Telegram channel</span>.',
		telegramSent: 'Result sent to Telegram bot!',
		telegramError:
			'Error sending result to Telegram bot! Please check your network connection or try again later.',
		leaveWarning:
			'The test is in progress! If you refresh the page, your progress will be lost. Are you sure you want to continue?',
		refreshWarning: 'The test is in progress! Refreshing the page is disabled.',
	},
	ru: {
		enterName: 'Введите свое имя и фамилию',
		enterPhone: 'Введите номер телефона: +998-(##)-###-##-##',
		start: 'Начать тест',
		selectTopic: '-- Выберите тему --',
		topicHTML: 'HTML',
		topicCSS: 'CSS',
		topicJS: 'JavaScript',
		topicEnglish: 'Английский язык',
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
		yourAnswer: 'Ваш ответ',
		correctAnswer: 'Правильный ответ',
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
		contactButton: 'Связаться',
		contactNameLabel: 'Имя и фамилия:',
		contactPhoneLabel: 'Телефон:',
		contactTelegramLabel: 'Телеграм:',
		contactTelegramChannelLabel: 'Телеграм канал:',
		contactInstagramLabel: 'Инстаграм:',
		contactTitle: '📬 Для связи',
		contactMessage:
			'Вы можете связаться с разработчиком через официальные страницы в <span class="custom-highlight">Telegram</span>, <span class="custom-highlight">Instagram</span> и других социальных сетях, указанных выше.',
		contactChannelMessage:
			'Также вы можете следить за проектами в портфолио и быть в курсе новостей через наш <span class="custom-highlight">Telegram-канал</span>.',
		telegramSent: 'Результат отправлен в Telegram-бот!',
		telegramError:
			'Ошибка при отправке результата в Telegram-бот! Пожалуйста, проверьте сетевое соединение или попробуйте снова позже.',
		leaveWarning:
			'Тест продолжается! Если вы обновите страницу, ваши результаты будут потеряны. Вы уверены, что хотите продолжить?',
		refreshWarning: 'Тест продолжается! Обновление страницы отключено.',
	},
}

/**
 * Tanlangan tilga mos matnni olish
 * @param {string} key - Matn kaliti (langData ichidagi kalit)
 * @param {...any} args - Agar matn funksiya bo'lsa, unga uzatiladigan argumentlar
 * @returns {string} - Tanlangan tilga mos matn yoki kalitning o'zi (agar topilmasa)
 */
function getLangText(key, ...args) {
	const val = langData[language]?.[key] // Tanlangan tildagi matnni olish
	return typeof val === 'function' ? val(...args) : val || key // Agar funksiya bo'lsa ishlatish, aks holda matnni yoki kalitni qaytarish
}

/**
 * Foydalanuvchiga xabar ko'rsatish uchun toast bildirishnoma yaratish
 * @param {string} message - Ko'rsatiladigan xabar
 * @param {string} type - Bildirishnoma turi (info, success, warning, danger)
 */
function showToast(message, type = 'info') {
	const toastContainer = document.getElementById('toastContainer') // Toast konteynerini olish
	const icon =
		{
			success: 'check-circle-fill',
			danger: 'exclamation-octagon-fill',
			warning: 'exclamation-triangle-fill',
			info: 'info-circle-fill',
		}[type] || 'info-circle-fill' // Bildirishnoma turiga mos ikonkani tanlash

	const toast = document.createElement('div') // Yangi toast elementi yaratish
	toast.className = `toast align-items-center text-bg-${type} border-0 show mb-2` // Toast stilini o'rnatish
	toast.setAttribute('role', 'alert') // Rolni o'rnatish
	toast.setAttribute('aria-live', 'assertive') // Aria atributlari
	toast.setAttribute('aria-atomic', 'true')
	toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        <i class="bi bi-${icon} me-2"></i>${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  ` // Toast ichki HTML tuzilmasi
	toastContainer.appendChild(toast) // Toastni konteynerga qo'shish
	setTimeout(() => toast.remove(), 5000) // 5 soniyadan keyin toastni o'chirish
}

/**
 * Kontakt oynasidagi soatni yangilash
 */
function updateClock() {
	const contactClock = document.getElementById('contactClock') // Soat elementi
	if (contactClock) {
		contactClock.innerText = formatClock() // Soatni formatlangan vaqt bilan yangilash
	}
}

/**
 * Kontakt ma'lumotlarini tanlangan tilga mos yangilash va yangi HTML tarkibni qo'shish
 */
function updateContactInfo() {
	const contactOffcanvasBody = document.querySelector(
		'#contactOffcanvas .offcanvas-body'
	) // Off-Canvas body elementi

	if (contactOffcanvasBody) {
		// Kontakt ma'lumotlari va yangi HTML tarkibni qo'shish
		contactOffcanvasBody.innerHTML = `
        <div class="contact-info">
            <p><i class="bi bi-person-circle me-2"></i><strong>${getLangText(
							'contactNameLabel'
						)}</strong> Akmaljon Yusupov</p>
            <p><i class="bi bi-telephone-fill me-2"></i><strong>${getLangText(
							'contactPhoneLabel'
						)}</strong> <a href="tel:+998885700209">+998-(88)-570-02-09</a></p>
            <p><i class="bi bi-telegram me-2"></i><strong>${getLangText(
							'contactTelegramLabel'
						)}</strong> <a href="https://t.me/AkmaljonYusupov" target="_blank">@AkmaljonYusupov</a></p>
            <p><i class="bi bi-telegram me-2"></i><strong>${getLangText(
							'contactTelegramChannelLabel'
						)}</strong> <a href="https://t.me/coder_ac" target="_blank">@coder_ac</a></p>
            <p><i class="bi bi-instagram me-2"></i><strong>${getLangText(
							'contactInstagramLabel'
						)}</strong> <a href="https://instagram.com/coder.ac" target="_blank">@coder.ac</a></p>
        </div>
				<div class="contact-clock text-center mt-4 border rounded bg-primary">
						<span id="contactClock" class="text-light" style="display: inline-block;">12:00:00 AM</span>
				</div>
				<div class="container my-4">
						<div class="custom-box">
								<div class="custom-title">${getLangText('contactTitle')}</div>
								<p>${getLangText('contactMessage')}</p>
								<p>${getLangText('contactChannelMessage')}</p>
						</div>
				</div>
        `
	}
}

/**
 * Klaviatura orqali sahifani yangilashni cheklash (F5, Ctrl+R, Cmd+R)
 * @param {KeyboardEvent} e - Klaviatura hodisasi
 */
function restrictRefreshKeys(e) {
	// F5 ni bloklash
	if (e.key === 'F5') {
		e.preventDefault()
		showToast(getLangText('refreshWarning'), 'warning')
	}
	// Ctrl+R yoki Cmd+R ni bloklash
	if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
		e.preventDefault()
		showToast(getLangText('refreshWarning'), 'warning')
	}
}

/**
 * Sahifa yuklanganda ishga tushadigan boshlang'ich sozlamalar va hodisalar
 */
document.addEventListener('DOMContentLoaded', () => {
	const phoneInput = document.getElementById('phoneInput') // Telefon kiritish maydoni
	const usernameInput = document.getElementById('usernameInput') // Ism kiritish maydoni
	const startButton = document.getElementById('startQuizButton') // Testni boshlash tugmasi
	const contactButton = document.querySelector('.contact-btn') // Kontakt tugmasi

	// Telefon raqamiga maskani qo'llash
	if (phoneInput) {
		if (typeof IMask === 'undefined') {
			console.error(
				'IMask is not loaded. Please check the CDN or network connection.'
			) // IMask yuklanmagan bo'lsa xato log qilish
			showToast(
				'Telefon raqam maskasi yuklanmadi. Iltimos, internet aloqasini tekshiring.',
				'danger'
			) // Xato haqida xabar ko'rsatish
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
		}) // Telefon raqamiga maskani qo'llash

		phoneInput.removeAttribute('readonly') // Maydonni faqat o'qish holatidan chiqarish
		phoneInput.removeAttribute('disabled') // Maydonni faol qilish

		// Til o'zgarishida placeholder yangilanishi
		document.getElementById('languageSelect').addEventListener('change', () => {
			phoneInput.placeholder = getLangText('enterPhone') // Telefon placeholderini yangilash
			updateContactInfo() // Kontakt ma'lumotlarini yangilash
			if (contactButton) {
				const tooltip = bootstrap.Tooltip.getInstance(contactButton) // Kontakt tugmasi uchun tooltip olish
				if (tooltip) {
					tooltip.setContent({ '.tooltip-inner': getLangText('contactButton') }) // Tooltip matnini yangilash
				}
			}
		})
	} else {
		console.error('phoneInput elementi topilmadi!') // Telefon maydoni topilmasa xato log qilish
	}

	// Ism kiritishni tekshirish va faqat harflarni qabul qilish
	if (usernameInput) {
		usernameInput.addEventListener('input', () => {
			const validInput = usernameInput.value.replace(/[^a-zA-Zа-яА-Я\s]/g, '') // Faqat harflar va bo'shliqlarni qoldirish
			if (usernameInput.value !== validInput) {
				usernameInput.value = validInput // Noto'g'ri belgilarni o'chirish
				showToast(getLangText('invalidName'), 'warning') // Xato haqida ogohlantirish
			}
		})
	} else {
		console.error('usernameInput elementi topilmadi!') // Ism maydoni topilmasa xato log qilish
	}

	// Testni boshlash tugmasiga hodisa qo'shish
	if (startButton) {
		startButton.addEventListener('click', () => {
			startQuiz() // Testni boshlash funksiyasini chaqirish
		})
		const startText = document.getElementById('startButton') // Tugma matni elementi
		if (startText) {
			startText.innerText = getLangText('start') // Tugma matnini yangilash
		}
	} else {
		console.error('startQuizButton elementi topilmadi!') // Tugma topilmasa xato log qilish
	}

	// Kontakt tugmasiga tooltip qo'shish
	if (contactButton) {
		new bootstrap.Tooltip(contactButton, {
			trigger: 'hover focus',
			placement: 'right',
			title: getLangText('contactButton'),
			customClass: 'custom-tooltip',
		}) // Kontakt tugmasiga tooltip qo'shish
	}

	// Kontakt oynasi ochilganda va yopilganda soatni boshqarish
	const contactOffcanvas = document.getElementById('contactOffcanvas') // Kontakt oynasi
	if (contactOffcanvas) {
		contactOffcanvas.addEventListener('shown.bs.offcanvas', () => {
			const closeButton = contactOffcanvas.querySelector('.btn-close') // Yopish tugmasi
			if (closeButton) closeButton.focus() // Yopish tugmasiga fokus qo'yish
			updateClock() // Soatni yangilash
			const clockInterval = setInterval(updateClock, 1000) // Har soniyada soatni yangilash
			contactOffcanvas.addEventListener(
				'hidden.bs.offcanvas',
				() => {
					clearInterval(clockInterval) // Oyna yopilganda intervalni to'xtatish
				},
				{ once: true }
			)
		})

		contactOffcanvas.addEventListener('hidden.bs.offcanvas', () => {
			if (contactButton) contactButton.focus() // Oyna yopilganda kontakt tugmasiga fokus qo'yish
		})
	}

	updateContactInfo() // Kontakt ma'lumotlarini dastlabki holatda yangilash
})

/**
 * Til o'zgarishida UI elementlarini yangilash
 */
document.getElementById('languageSelect').addEventListener('change', () => {
	language = document.getElementById('languageSelect').value // Yangi tilni olish
	document.getElementById('enterNameText').innerText = getLangText('enterName') // Ism kiritish yorlig'ini yangilash
	document.getElementById('startButton').innerText = getLangText('start') // Boshlash tugmasi matnini yangilash
	document.getElementById('prepTitle').innerText = getLangText('prepTitle') // Tayyorgarlik sarlavhasini yangilash
	document.getElementById('totalTimeLabel').innerText = getLangText('totalTime') // Umumiy vaqt yorlig'ini yangilash
	document.getElementById('nextBtnText').innerText = getLangText('next') // "Keyingi" tugmasi matnini yangilash
	document.getElementById('prevBtnText').innerText = getLangText('prev') // "Ortga" tugmasi matnini yangilash
	document.getElementById('questionCountInput').placeholder =
		getLangText('enterCount') // Savollar soni placeholderini yangilash
	document.getElementById('usernameInput').placeholder =
		getLangText('enterYourName') // Ism placeholderini yangilash

	const topicSelect = document.getElementById('topicSelect') // Mavzular ro'yxati
	topicSelect.options[0].text = getLangText('selectTopic') // "-- Mavzuni tanlang --"
	topicSelect.options[1].text = getLangText('topicHTML') // "HTML"
	topicSelect.options[2].text = getLangText('topicCSS') // "CSS"
	topicSelect.options[3].text = getLangText('topicJS') // "JavaScript"
	topicSelect.options[4].text = getLangText('topicEnglish') // "Ingliz tili"

	const prepCountdownValue =
		document.getElementById('prepCountdown')?.innerText || 10 // Tayyorgarlik vaqti (standart: 10)
	const prepTimerSuffix = document.getElementById('prepTimerSuffix') // Tayyorgarlik vaqt suffiksi
	if (prepTimerSuffix) {
		prepTimerSuffix.textContent = getLangText('questionTimerSuffix') // Suffiksni yangilash
	}
	document.getElementById('prepText').innerText = getLangText(
		'prepTimer',
		prepCountdownValue
	) // Tayyorgarlik matnini yangilash
	const totalTimerSuffix = document.getElementById('totalTimerSuffix') // Umumiy vaqt suffiksi
	if (totalTimerSuffix) {
		totalTimerSuffix.textContent = '' // Suffiksni tozalash
	}
	updateContactInfo() // Kontakt ma'lumotlarini yangilash
})

/**
 * Testni boshlash: foydalanuvchi kiritgan ma'lumotlarni tekshirish va savollarni yuklash
 */
async function startQuiz() {
	username = document.getElementById('usernameInput')?.value.trim() || '' // Foydalanuvchi ismini olish
	phoneNumber = document.getElementById('phoneInput')?.value.trim() || '' // Telefon raqamini olish
	selectedTopic = document.getElementById('topicSelect')?.value || '' // Tanlangan mavzuni olish
	language = document.getElementById('languageSelect')?.value || 'uz' // Tanlangan tilni olish
	const questionCountInput = document.getElementById('questionCountInput') // Savollar soni maydoni
	const questionCount = questionCountInput
		? parseInt(questionCountInput.value)
		: 0 // Savollar sonini olish

	// Ismni tekshirish (faqat harflar va bo'shliqlar, uzunligi 10+ belgi)
	const nameRegex = /^[a-zA-Zа-яА-Я\s]+$/
	if (!nameRegex.test(username) || username.length < 10) {
		showToast(getLangText('invalidName'), 'warning') // Xato haqida ogohlantirish
		return
	}

	// Ism va familiya alohida bo'lishini tekshirish
	const nameParts = username.split(' ').filter(part => part.length > 0)
	if (nameParts.length < 2) {
		showToast(getLangText('invalidName'), 'warning') // Xato haqida ogohlantirish
		return
	}

	// Telefon raqamini tekshirish
	const phoneRegex = /^\+998-\(\d{2}\)-\d{3}-\d{2}-\d{2}$/
	if (!phoneRegex.test(phoneNumber)) {
		showToast(getLangText('invalidPhone'), 'warning') // Xato haqida ogohlantirish
		return
	}

	// Mavzu tanlanganligini tekshirish
	if (!selectedTopic) {
		showToast(getLangText('invalidTopic'), 'warning') // Xato haqida ogohlantirish
		return
	}

	// Savollar sonini tekshirish (1 yoki undan ko'p)
	if (isNaN(questionCount) || questionCount <= 0) {
		showToast(getLangText('invalidCount'), 'warning') // Xato haqida ogohlantirish
		return
	}

	try {
		const res = await fetch('/questions.json') // Savollarni yuklash
		if (!res.ok) {
			throw new Error(
				`Failed to fetch questions.json: ${res.status} ${res.statusText}`
			) // Yuklashda xato bo'lsa xatolik tashlash
		}
		const data = await res.json() // JSON formatiga aylantirish
		allQuestions = data.filter(q => {
			return (
				q.topic === selectedTopic && // Tanlangan mavzuga mos savollar
				q.question?.[language] && // Savol matni tilda mavjud
				Array.isArray(q.options?.[language]) && // Variantlar massiv bo'lishi
				q.options[language].length > 0 && // Variantlar bo'sh emas
				typeof q.correct === 'number' && // To'g'ri javob indeksi raqam bo'lishi
				q.correct >= 0 && // To'g'ri javob indeksi 0 yoki undan katta
				q.correct < q.options[language].length // To'g'ri javob indeksi variantlar sonidan kichik
			)
		})

		// Agar savollar topilmasa
		if (allQuestions.length === 0) {
			showToast(getLangText('notFound'), 'danger') // Xato haqida ogohlantirish
			return
		}
		// Agar so'ralgan savollar soni mavjud savollardan ko'p bo'lsa
		if (questionCount > allQuestions.length) {
			showToast(getLangText('exceeds', allQuestions.length), 'warning') // Xato haqida ogohlantirish
			return
		}

		// Savollarni tanlash va aralashtirish
		shuffledQuestions = shuffleArray(allQuestions).slice(0, questionCount)

		// Har bir savol uchun variantlarni aralashtirish va yangi to'g'ri javob indeksini saqlash
		shuffledQuestions = shuffledQuestions.map(q => {
			const originalOptions = q.options[language] // Asl variantlar
			const shuffledOptions = shuffleArray([...originalOptions]) // Variantlarni aralashtirish
			const newCorrectIndex = shuffledOptions.indexOf(
				originalOptions[q.correct]
			) // Yangi to'g'ri javob indeksini aniqlash
			return {
				...q,
				options: { [language]: shuffledOptions }, // Aralashtirilgan variantlarni saqlash
				correct: newCorrectIndex, // Yangi to'g'ri javob indeksini saqlash
			}
		})

		userAnswers = new Array(shuffledQuestions.length).fill(null) // Foydalanuvchi javoblarini boshlang'ich holatda to'ldirish
		currentQuestion = 0 // Joriy savol indeksini 0 ga o'rnatish
		totalTime = shuffledQuestions.length * questionTime // Umumiy vaqtni hisoblash
		initialTotalTime = totalTime // Dastlabki umumiy vaqtni saqlash

		// Sahifani yangilashni bloklash
		isQuizActive = true // Test faol holatda ekanligini belgilash
		window.onbeforeunload = handleBeforeUnload // beforeunload hodisa tinglovchisini qo'shish
		document.addEventListener('keydown', restrictRefreshKeys) // Klaviatura hodisalarini bloklash

		const usernameForm = document.getElementById('usernameForm') // Foydalanuvchi ma'lumotlari formasi
		const prepOverlay = document.getElementById('prepOverlay') // Tayyorgarlik oynasi
		const quizSection = document.getElementById('quizSection') // Test bo'limi
		if (usernameForm) usernameForm.classList.add('d-none') // Formani yashirish
		if (prepOverlay) prepOverlay.classList.remove('d-none') // Tayyorgarlik oynasini ko'rsatish
		if (quizSection) quizSection.classList.remove('d-none') // Test bo'limini ko'rsatish
		startPreparation() // Tayyorgarlikni boshlash
	} catch (err) {
		console.error('Error in startQuiz:', err) // Xatolikni log qilish
		showToast(
			'Savollarni yuklab bo‘lmadi! Fayllar to‘g‘ri joylashganligini tekshiring.',
			'danger'
		) // Xato haqida ogohlantirish
		isQuizActive = false // Test faol emasligini belgilash
		window.onbeforeunload = null // beforeunload hodisa tinglovchisini o'chirish
		document.removeEventListener('keydown', restrictRefreshKeys) // Klaviatura hodisa tinglovchisini o'chirish
	}
}

/**
 * Sahifani yangilash yoki yopishdan oldin ogohlantirish ko'rsatish (alert ishlatilmaydi)
 */
function handleBeforeUnload(e) {
	if (isQuizActive) {
		e.preventDefault() // Standart harakatni bekor qilish
		showToast(getLangText('refreshWarning'), 'warning') // Ogohlantirish toast orqali ko'rsatiladi
		e.returnValue = '' // Brauzerning standart ogohlantirishini yoqmaslik uchun bo'sh qaytarish
		return '' // Qaytariladigan qiymat bo'sh bo'ladi
	}
}

/**
 * Test boshlanishidan oldin 10 soniyalik tayyorgarlik vaqtini ko'rsatish
 */
function startPreparation() {
	let prepTime = 10 // Tayyorgarlik vaqti (soniyalarda)
	const prepCountdown = document.getElementById('prepCountdown') // Tayyorgarlik vaqt ko'rsatgichi
	const prepText = document.getElementById('prepText') // Tayyorgarlik matni
	const prepTimerSuffix = document.getElementById('prepTimerSuffix') // Tayyorgarlik vaqt suffiksi

	if (!prepCountdown || !prepText || !prepTimerSuffix) {
		console.error(
			'prepCountdown, prepText yoki prepTimerSuffix elementi topilmadi!'
		) // Elementlar topilmasa xato log qilish
		return
	}

	prepCountdown.textContent = prepTime // Vaqtni ko'rsatish
	prepTimerSuffix.textContent = getLangText('questionTimerSuffix') // Suffiksni yangilash

	const interval = setInterval(() => {
		prepTime-- // Vaqtni 1 soniyaga kamaytirish
		prepCountdown.textContent = prepTime // Yangi vaqtni ko'rsatish

		if (prepTime <= 0) {
			clearInterval(interval) // Intervalni to'xtatish
			const prepOverlay = document.getElementById('prepOverlay') // Tayyorgarlik oynasi
			const quizSection = document.getElementById('quizSection') // Test bo'limi
			if (prepOverlay) prepOverlay.classList.add('d-none') // Tayyorgarlik oynasini yashirish
			if (quizSection) {
				quizSection.style.pointerEvents = 'auto' // Test bo'limini faol qilish
				quizSection.style.opacity = '1' // Test bo'limini ko'rinadigan qilish
			}
			startTimers() // Taymerlarni boshlash
			loadQuestion(currentQuestion) // Birinchi savolni yuklash
			startQuestionTimer() // Savol taymerini boshlash
		}
	}, 1000) // Har soniyada ishlaydigan interval
}

/**
 * Umumiy vaqt taymerini boshlash va vaqt tugashi holatini boshqarish
 */
function startTimers() {
	totalTimerDisplay.textContent = formatTime(totalTime) // Umumiy vaqtni ko'rsatish (HH:MM:SS formatida)
	const totalTimerSuffix = document.getElementById('totalTimerSuffix') // Umumiy vaqt suffiksi
	if (totalTimerSuffix) {
		totalTimerSuffix.textContent = '' // Suffiksni tozalash
	}

	document.title = `Quiz Test - ${formatTime(totalTime)}` // Sahifa sarlavhasini yangilash

	totalInterval = setInterval(() => {
		totalTime-- // Umumiy vaqtni 1 soniyaga kamaytirish
		totalTimerDisplay.textContent = formatTime(totalTime) // Yangi vaqtni ko'rsatish
		document.title = `Quiz Test - ${formatTime(totalTime)}` // Sahifa sarlavhasini yangilash

		if (totalTime === 20 && !warningShown) {
			showToast(getLangText('timeWarning'), 'warning') // 20 soniya qolganda ogohlantirish
			warningShown = true // Ogohlantirish ko'rsatildi deb belgilash
		}

		if (totalTime <= 0) {
			clearInterval(totalInterval) // Umumiy taymerni to'xtatish
			clearInterval(questionInterval) // Savol taymerini to'xtatish
			showResult(true) // Vaqt tugashi sababli natijani ko'rsatish
		}
	}, 1000) // Har soniyada ishlaydigan interval
}

/**
 * Joriy savol uchun vaqt taymerini boshlash
 */
function startQuestionTimer() {
	clearInterval(questionInterval) // Oldingi taymerni to'xtatish
	let timeLeft = questionTime // Savol uchun vaqtni o'rnatish
	const questionTimer = document.getElementById('questionTimer') // Savol vaqt ko'rsatgichi

	if (!questionTimer) {
		console.error('questionTimer elementi topilmadi!') // Element topilmasa xato log qilish
		return
	}

	questionTimer.textContent = timeLeft // Vaqtni ko'rsatish

	questionInterval = setInterval(() => {
		timeLeft-- // Vaqtni 1 soniyaga kamaytirish
		questionTimer.textContent = timeLeft // Yangi vaqtni ko'rsatish
		if (timeLeft <= 0) {
			clearInterval(questionInterval) // Taymerni to'xtatish
			autoNext() // Keyingi savolga avtomatik o'tish
		}
	}, 1000) // Har soniyada ishlaydigan interval
}

/**
 * Savol vaqti tugaganda avtomatik ravishda keyingi savolga o'tish yoki natijani ko'rsatish
 */
function autoNext() {
	if (currentQuestion < shuffledQuestions.length - 1) {
		currentQuestion++ // Joriy savol indeksini oshirish
		loadQuestion(currentQuestion) // Keyingi savolni yuklash
	} else {
		showResult(false) // Agar oxirgi savol bo'lsa, natijani ko'rsatish
	}
}

/**
 * Berilgan indeksdagi savolni yuklash va ko'rsatish
 * @param {number} index - Yuklanadigan savol indeksi
 */
function loadQuestion(index) {
	const q = shuffledQuestions[index] // Joriy savol ob'ekti
	const options = q.options[language] // Tanlangan tildagi variantlar (qayta aralashtirilmaydi)
	const questionText = q.question[language] // Tanlangan tildagi savol matni

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
  ` // Savol va variantlarni HTML sifatida konteynerga joylashtirish

	prevBtn.disabled = index === 0 // Agar birinchi savol bo'lsa, "Ortga" tugmasini o'chirish
	nextBtn.innerHTML =
		index === shuffledQuestions.length - 1
			? `<i class="bi bi-flag-fill me-1"></i>${getLangText('finish')}` // Oxirgi savol bo'lsa "Yakunlash"
			: `${getLangText(
					'next'
			  )} <i class="bi bi-arrow-right-circle-fill ms-1"></i>` // Aks holda "Keyingi"

	updateProgress() // Progress barni yangilash
	startQuestionTimer() // Savol taymerini boshlash
	window.scrollTo({ top: 0, behavior: 'smooth' }) // Sahifani yuqoriga siljitish
}

/**
 * Progress barni yangilash: javob berilgan savollar foizini ko'rsatish
 */
function updateProgress() {
	const answered = userAnswers.filter(v => v !== null).length // Javob berilgan savollar soni
	const percent = Math.round((answered / shuffledQuestions.length) * 100) // Foiz sifatida hisoblash
	progressBar.style.width = `${percent}%` // Progress bar kengligini o'rnatish
	progressBar.innerText = `${percent}%` // Foizni ko'rsatish
}

/**
 * Test natijasini ko'rsatish
 * @param {boolean} timeUp - Vaqt tugaganligini bildiruvchi flag
 */
async function showResult(timeUp) {
	clearInterval(questionInterval) // Savol taymerini to'xtatish
	if (!timeUp) {
		clearInterval(totalInterval) // Agar vaqt tugamagan bo'lsa, umumiy taymerni to'xtatish
	}

	let score = 0 // Foydalanuvchi to'plagan ball
	quizContainer.innerHTML = shuffledQuestions
		.map((q, i) => {
			const userAnswer = userAnswers[i] // Foydalanuvchi tanlagan javob indeksi
			const isCorrect = userAnswer === q.correct // Javob to'g'ri yoki noto'g'ri
			if (isCorrect) score++ // To'g'ri javob bo'lsa ballni oshirish
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
      </div>` // Har bir savol va javobni HTML sifatida ko'rsatish
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
  ` // Natija ma'lumotlarini ko'rsatish

	nextBtn.style.display = 'none' // "Keyingi" tugmasini yashirish
	prevBtn.style.display = 'none' // "Ortga" tugmasini yashirish
	progressBar.style.width = '100%' // Progress barni 100% ga o'rnatish
	progressBar.innerText = '100%' // Foizni 100% deb ko'rsatish
	totalTimerDisplay.textContent = '00:00:00' // Umumiy vaqtni 0 deb ko'rsatish
	document.title = `Quiz Test - ${getLangText('resultTitle')}` // Sahifa sarlavhasini yangilash

	// Test tugaganidan so'ng sahifani yangilashga ruxsat berish
	isQuizActive = false // Test faol emasligini belgilash
	window.onbeforeunload = null // beforeunload hodisa tinglovchisini o'chirish
	document.removeEventListener('keydown', restrictRefreshKeys) // Klaviatura hodisa tinglovchisini o'chirish

	await sendToTelegram(score) // Natijani Telegramga yuborish
}

/**
 * Test natijasini Telegram botga yuborish (qayta urinish mexanizmi bilan)
 * @param {number} score - Foydalanuvchi to'plagan ball
 * @param {number} maxRetries - Maksimal qayta urinishlar soni (standart: 3)
 * @param {number} retryDelay - Qayta urinishlar orasidagi kechikish (ms, standart: 2000)
 */
async function sendToTelegram(score, maxRetries = 3, retryDelay = 2000) {
	const botToken = '7649780620:AAHRveFJGphrW_VmL7ILdghc0oZVbn_uVcM' // Telegram bot tokeni
	const chatId = '630353326' // Telegram chat ID
	const now = new Date() // Joriy sana va vaqt
	const formattedDate = now.toLocaleDateString(
		language === 'uz' ? 'uz-UZ' : language === 'en' ? 'en-US' : 'ru-RU'
	) // Sanani formatlash
	const formattedTime = now.toLocaleTimeString(
		language === 'uz' ? 'uz-UZ' : language === 'en' ? 'en-US' : 'ru-RU'
	) // Vaqtni formatlash
	const languageName = getLangText(`lang_${language}`) // Tanlangan til nomini olish
	const timeSpent = initialTotalTime - totalTime // Sarflangan vaqtni hisoblash
	const formattedTimeSpent = formatTime(timeSpent) // Sarflangan vaqtni HH:MM:SS formatida ko'rsatish

	const message = `
📋 *${getLangText('downloadTitle')}*

👤 *${getLangText('name')}* ${username}
📞 *${getLangText('phone')}* ${phoneNumber}
📚 *${getLangText('topic')}* ${getLangText(`topic${selectedTopic}`)}
🌐 *${getLangText('language')}* ${languageName}
📅 *${getLangText('date')}* ${formattedDate}
⏰ *${getLangText('time')}* ${formattedTime}
🏆 *${getLangText('score')}* ${score}/${shuffledQuestions.length}
⏳ *${getLangText('timeSpent')}* ${formattedTimeSpent}
  ` // Telegramga yuboriladigan xabar

	const url = `https://api.telegram.org/bot${botToken}/sendMessage` // Telegram API manzili

	let retries = 0 // Qayta urinishlar soni
	while (retries < maxRetries) {
		try {
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					chat_id: chatId,
					text: message,
					parse_mode: 'Markdown',
				}),
			})

			if (response.ok) {
				showToast(getLangText('telegramSent'), 'success') // Muvaffaqiyatli yuborilganligi haqida xabar
				return
			} else {
				throw new Error(`Telegram API error: ${response.status}`) // API xatosi
			}
		} catch (err) {
			retries++ // Qayta urinishlar sonini oshirish
			if (retries === maxRetries) {
				console.error('Failed to send to Telegram after retries:', err) // Xatolikni log qilish
				showToast(getLangText('telegramError'), 'danger') // Xato haqida ogohlantirish
				return
			}
			await new Promise(resolve => setTimeout(resolve, retryDelay)) // Qayta urinishdan oldin kechikish
		}
	}
}

/**
 * Test natijasini PDF sifatida yuklab olish
 */
function downloadPDF() {
	const { jsPDF } = window.jspdf // jsPDF kutubxonasini olish
	const doc = new jsPDF() // Yangi PDF hujjatini yaratish
	const now = new Date() // Joriy sana va vaqt
	const formattedDate = now.toLocaleDateString(
		language === 'uz' ? 'uz-UZ' : language === 'en' ? 'en-US' : 'ru-RU'
	) // Sanani formatlash
	const formattedTime = now.toLocaleTimeString(
		language === 'uz' ? 'uz-UZ' : language === 'en' ? 'en-US' : 'ru-RU'
	) // Vaqtni formatlash
	const languageName = getLangText(`lang_${language}`) // Tanlangan til nomini olish

	doc.setFontSize(16) // Shrift o'lchamini o'rnatish
	doc.text(getLangText('downloadTitle'), 10, 10) // Sarlavha qo'shish

	doc.setFontSize(12) // Shrift o'lchamini kichiklashtirish
	let y = 20 // Matnning vertikal joylashuvi
	doc.text(`${getLangText('name')} ${username}`, 10, y) // Ismni qo'shish
	y += 10
	doc.text(`${getLangText('phone')} ${phoneNumber}`, 10, y) // Telefonni qo'shish
	y += 10
	doc.text(
		`${getLangText('topic')} ${getLangText(`topic${selectedTopic}`)}`,
		10,
		y
	) // Mavzuni qo'shish
	y += 10
	doc.text(`${getLangText('language')} ${languageName}`, 10, y) // Tilni qo'shish
	y += 10
	doc.text(`${getLangText('date')} ${formattedDate}`, 10, y) // Sanani qo'shish
	y += 10
	doc.text(`${getLangText('time')} ${formattedTime}`, 10, y) // Vaqtni qo'shish
	y += 10

	let score = 0 // Ballni qayta hisoblash
	shuffledQuestions.forEach((q, i) => {
		if (userAnswers[i] === q.correct) score++ // To'g'ri javoblar sonini hisoblash
	})

	doc.text(
		`${getLangText('score')} ${score}/${shuffledQuestions.length}`,
		10,
		y
	) // Ballni qo'shish
	y += 10

	const timeSpent = initialTotalTime - totalTime // Sarflangan vaqtni hisoblash
	const formattedTimeSpent = formatTime(timeSpent) // Sarflangan vaqtni HH:MM:SS formatida ko'rsatish
	doc.text(`${getLangText('timeSpent')} ${formattedTimeSpent}`, 10, y) // Sarflangan vaqtni qo'shish

	doc.save('quiz-result.pdf') // PDFni yuklab olish
}

/**
 * Foydalanuvchi javobini saqlash va keyingi savolga o'tish
 */
nextBtn.addEventListener('click', () => {
	const selectedOption = document.querySelector(
		'input[name="question"]:checked'
	) // Tanlangan variantni olish
	if (!selectedOption) {
		showToast(getLangText('noSelection'), 'warning') // Tanlov yo'qligi haqida ogohlantirish
		return
	}

	userAnswers[currentQuestion] = parseInt(selectedOption.value) // Tanlangan javobni saqlash
	updateProgress() // Progress barni yangilash

	if (currentQuestion < shuffledQuestions.length - 1) {
		currentQuestion++ // Keyingi savolga o'tish
		loadQuestion(currentQuestion) // Keyingi savolni yuklash
	} else {
		showResult(false) // Agar oxirgi savol bo'lsa, natijani ko'rsatish
	}
})

/**
 * Oldingi savolga qaytish
 */
prevBtn.addEventListener('click', () => {
	if (currentQuestion > 0) {
		currentQuestion-- // Oldingi savolga qaytish
		loadQuestion(currentQuestion) // Oldingi savolni yuklash
	}
})
