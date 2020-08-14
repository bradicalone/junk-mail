import { _ , BlowTrash, BlowDust } from './blowTrash.js'

let resize = {
	getWidth: function(){
			let formContainer = document.getElementsByClassName('formContainer')[0].getBoundingClientRect().width
			let size = window.innerWidth - formContainer
			return size
	},
	call: function(){
		let width = resize.getWidth()
		new BlowDust(width, resize);
	},
	getItemSize: function(){
		//returns 3.75% of half the canvas width
		return this.getWidth() / 2 * .09
	}
}


let blowTrash = new BlowDust(resize.getWidth(), resize)
window.addEventListener('resize', resize.call);
// blowTrash.beginAnimation()


function signUp(){
	const runnersElem = '<div class="runners"><img src="assets/images/left-leg.svg"/><img  src="assets/images/right-leg.svg"/></div>'
	const input = _('email')
	
	let runnerCount = 0

	function end(){
		runnerCount = 0
		input.setAttribute('placeholder', "Email")
		_('drain').classList.add('down-drain')
		_('down-drain').addEventListener("animationend", blowTrash.beginAnimation.bind(blowTrash), {once: true});
	}
		
	//jerryjackson@yahoo.com
	document.getElementsByTagName('form')[0].addEventListener('submit', function(e){
		e.preventDefault();
		_('runner-wrap').innerHTML = '<div class="text-men"></div>'

		// Split email into an array
		let email = e.target.elements[0].value
		let email_letter = email.split('')

		_('trash-lid').classList += ' lid-rotate'
		_('trash-can').style.zIndex = 1
		_('runner-wrap').style.zIndex = 1
		input.setAttribute('placeholder', "")

		for(var i = email_letter.length-1; i >= 0; i--){
			appendLetters(i, email_letter, e)
		}
	})

	function appendLetters(i, text, e){
		let letter = document.createTextNode(text[i]+'');
		let para = document.createElement('p');
		para.appendChild(letter);
		
		_('text-men').insertAdjacentHTML('afterbegin', runnersElem);
		_('runners').insertBefore(para, _('runners').childNodes[0]).className += 'textNode'
		
		e.target.elements[0].value = ""

		_('runners').addEventListener("animationend", function(){
			if(++runnerCount === text.length) end()
		});

		if(i%2 !== 0){
			//Randomly places men closer to each other to the left of input
			const left = Math.floor(Math.random() * 15)
			_('runners').style.left = '-' + left + 'px'
			
		}
		 _('runners').childNodes[1].className += 'left-leg';
		 _('runners').childNodes[2].className += 'right-leg';
		 _('runners').className += ' running'
		 _('text-men').classList.add('bounce')
				
	}
}
signUp();
