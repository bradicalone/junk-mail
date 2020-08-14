export const _ = function(name){
	return document.getElementsByClassName(name)[0];
}

export function BlowTrash(newWidth, resize){
	let size = newWidth / 2 || resize.getWidth() / 2

	let canvas = document.getElementsByClassName('canvas')[0]
	let ctx = canvas.getContext('2d')
	let width = ctx.canvas.width = size
	let height = ctx.canvas.height = size

	this.imageData = {
		width: [15, 5, 5],
		height: [30, 10, 10],
		img: [],
		src: ['assets/images/trash.svg', 'assets/images/trash-light.svg','assets/images/trash-light.svg'],
		dir: [0, -20, 20]
	}

	this.loadImages = function(){
		let count = 0;
		let img = []
		for(var i = 0; i < this.imageData.src.length; i++){

			img.push(new Image())

			try {
				throw i
			}
			catch(i){
				img[i].onload = function(){

					var data = {
						img: img[i],
						width: i === 0 ? resize.getItemSize() : resize.getItemSize() / 3,
						height: i === 0 ? resize.getItemSize() * 2 : resize.getItemSize() / 3 ,
						x:  2,
						y:  height / 2,
						start: 0,
						dist: i === 0 ? width / 1.3 : width / 1.5,
						//Keeps first element at 0 going straight, other two up and down
						dir: this.imageData.dir[i]
					}
					img.push(data)
		
					if(++count === 3){
						//Remove current new image tags
						img.splice(0,3)
					
						var sort = img.sort(function(a,b){
							
							return b.dist - a.dist;
						})
						console.log(sort);
						this.imageData.img.push(sort)
					}
				}.bind(this)
				img[i].src = this.imageData.src[i]

			}
		}
	}
	this.loadImages();

	const getProgress = function(elapsed, total){
		return Math.min(elapsed / total, 1)
	}
	var run = function(img){
		
		ctx.setTransform(1, 0, 0, 1, img.forward +15, img.vert)
		ctx.save()
		ctx.globalAlpha = img.alpha
		ctx.drawImage(img.img, 0, 0, img.width, img.height)
		ctx.restore()
		ctx.setTransform(1, 0, 0, 1, 0, 0)
	}
	this.draw = function(timestamp){
		let j = 0;
		//Sorts images array distance come in at 0 index
		let image = this.imageData.img[0];
		
		ctx.clearRect(0,0,width, height)

		for(var i = 0; i < image.length; i++){

			var img = image[i]
	
			if( i === j){
				
				if(img.delay > 10)j++
		
				if(!img.start) img.start = timestamp
				var runtime = timestamp - img.start
				var progress = getProgress(runtime, 1100)
				img.alpha =  1 - (1* progress);
	
				img.forward = img.x + (img.dist * progress)

				img.vert =  img.y + (img.dir * progress)
				img.delay = img.forward
				if(progress < 1){
					run(img)
				}else{
					//End of Animation, Reset Elements
					_('trash-lid').classList.remove('lid-rotate')
					_('text-men').parentNode.removeChild(_('text-men'))
					_('runner-wrap').style.zIndex = -1
					_('drain').classList.remove('down-drain')
					_('trash-can').style.zIndex = 0
					for(var i = 0; i < image.length; i++){
						image[i].start = 0;
					}
					return
				} 	
				

			}
		}
		requestAnimationFrame(this.draw.bind(this))
	}
	this.beginAnimation = function(){
		requestAnimationFrame(function(timestamp){
			console.log(this);
			this.draw(timestamp)
		}.bind(this))

	}
}

export function BlowDust(newWidth, resize){

		let size = newWidth / 2 || resize.getWidth() / 2
		console.log('size:', size)
	
		let canvas = _('canvas')
		let ctx = canvas.getContext('2d')
		let width = ctx.canvas.width = size
		let height = ctx.canvas.height = size
		let arcData = []
		let lastPositions = []

		let getProgress = function(elapsed, total){
			return Math.min(elapsed / total, 1)
		}
		let randomY = function() {
			const min = height / 2 - 2
			const max = height / 2 + 2
			return Math.random() * (max - min) + min
		}
		let randomRadius = function() {
			const min = 15
			const max = 25
			return Math.random() * (max - min) + min
		}
		let randomXdistance = function() {
			const min = width - 20
			const max = width 
			return Math.random() * (max - min) + min
		}
		let randomYdistance = function() {
			const min = 0
			const max = 20
			return Math.random() * (max - min) + min
		}
		let randomLineWidth = function() {
			const min = 3
			const max = 9
			return Math.random() * (max - min) + min
		}

		let storeLastPostion = function(x, y, radius) {
			let motionTrailLength = 120;
			lastPositions.push({
				x: x,
				y: y,
				rad: radius
			})

			//get rid of first item
			if (lastPositions.length > motionTrailLength) {
				lastPositions.shift();
			}
		}

		let loadArcData = function() {
			let circleCount = 10
			for(let i = 0; i < circleCount; i++) {
				arcData.push({
					start: 0,
					xStart: 0,
					xDist: randomXdistance(),
					yDist: randomYdistance(),
					y: randomY(),
					radius: randomRadius(),
					lineWidth: randomLineWidth()
				})
			}
		}
		loadArcData()

		let run = function(xPos, yPos, radius, alpha, lineWidth){
			ctx.clearRect(0,0,width, height)

			// Makes a trail by running the array of last positioned data
			for (let i = 0; i < lastPositions.length; i++) {
				let ratio = (i + 1) / lastPositions.length;

				ctx.beginPath();
				ctx.arc(lastPositions[i].x, lastPositions[i].y, lastPositions[i].rad, 0, 2 * Math.PI, true);
				ctx.fillStyle = "rgba(0, 255, 255,0)";
				ctx.strokeStyle = "rgba(0, 255, 255," + ratio/4 +")";
				ctx.lineWidth = lineWidth;
				ctx.stroke()
				ctx.fill();
			}

			ctx.beginPath()
			ctx.arc(xPos, yPos, radius, 0, 2 * Math.PI, false)
			ctx.fillStyle = "rgba(0, 255, 255,0)";
			ctx.strokeStyle = "rgba(0, 255, 255,1)";
			ctx.lineWidth = lineWidth;
			ctx.stroke()
			ctx.closePath()
			
			ctx.globalAlpha = alpha;
			storeLastPostion(xPos, yPos, radius)
		}

		this.draw = timestamp => {
			let length = arcData.length

			for(let i = 0; i < length; i++){
				let data = arcData[i]

				if(!data.start) data.start = timestamp
				let runtime = timestamp - data.start
				let progress = getProgress(runtime, 1100)
				
				let xPos = data.xStart + (data.xDist * progress)
				let radius = data.radius * progress
				let alpha = 1 - (1 * progress)

				// smoke either drawn up or down
				let yPos = () => {
					if(i % 2 === 0) {
						return data.y + (data.yDist * progress)
					} else 
						return data.y - (data.yDist * progress)
				}

				if(progress < 1) {
					run(xPos, yPos(), radius, alpha, data.lineWidth)
				} else {

					// End of Animation, reset Elements
					ctx.clearRect(0,0,width, height)
					_('trash-lid').classList.remove('lid-rotate')
					_('text-men').parentNode.removeChild(_('text-men'))
					_('runner-wrap').style.zIndex = -1
					_('drain').classList.remove('down-drain')
					_('trash-can').style.zIndex = 0
					arcData.length = 0
					lastPositions.length = 0
					loadArcData()
					return;
				} 	

			}
			requestAnimationFrame(this.draw)
		}
		this.beginAnimation = function(){
			requestAnimationFrame((timestamp) => {
				this.draw(timestamp)
			})
		}
	}

// export default BlowTrash