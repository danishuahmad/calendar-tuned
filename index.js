var width = window.innerWidth;
var height = window.innerHeight;

const rectWidth = document.getElementById("border-line-1").offsetWidth
const lineOffsetData = getOffset(document.getElementById("border-line-1"))
const lineDimensionsData = getDimensions(document.getElementById("border-line-1"))

//  default position for drag
const position = { x: 0, y: 0 }

const interactable = interact('.resizable-slot-box').draggable({
	modifiers: [
		interact.modifiers.restrictRect({
			restriction: '#one-pane'
		}),
		interact.modifiers.snapSize({
			targets: [
				interact.snappers.grid({ width: 100, height: SLOT_BOX_HEGHT }),
			],
		}),
	],
	autoScroll: {
		container: '#one-panel',
		speed: 600,
	},
	listeners: {
		startAxis: 'y',
		lockAxis: 'start',
		move(event) {


			position.y += event.dy
			// console.log({drag:position.y})

			// if( (position.y + event.rect.height) > 1320 ){
			// 	return
			// }

			event.target.style.transform = `translate(${position.x}px, ${position.y}px)`
		},
	}
}).resizable({
	allowFrom: '.slot-box-handle',
	edges: { top: true, left: false, bottom: true, right: false },
	listeners: {
		startAxis: 'y',
		lockAxis: 'start',
		move: function (event) {

			//	get existing transformY value of slot-box
			let existingY = getTranslateYValue(event.target.style.transform)
			if( isNaN(existingY) ) existingY = 0

			let { x, y } = event.target.dataset

			x = (parseFloat(x) || 0) + event.deltaRect.left
			y = (parseFloat(y) || 0) + event.deltaRect.top

			//	if resize upwards
			if( y != 0 ){
				Object.assign(event.target.style, {
					width: `${event.rect.width}px`,
					height: `${event.rect.height}px`,
					transform: `translate(${x}px, ${existingY+y}px)`
				})
				// Object.assign(event.target.dataset, { x, y })
			}else{	//	resize downwards
				Object.assign(event.target.style, {
					width: `${event.rect.width}px`,
					height: `${event.rect.height}px`,
				})
			}
		
		}
	},
	modifiers: [
		interact.modifiers.restrictSize({
			min: { width: 100, height: SLOT_BOX_HEGHT },
		}),
		interact.modifiers.restrictEdges({
			outer: '#one-pane',
		}),
		interact.modifiers.snapSize({
			targets: [
				interact.snappers.grid({ width: 100, height: SLOT_BOX_HEGHT }),
			],
		}),
	],
	autoScroll: {
		container: '#one-panel',
		speed: 600,
	}
})

interactable.on(['resizeend', 'dragend'], showEventInfo)

async function showEventInfo(event) {
	console.log(event.type)

	if( event.type === 'dragend' ){
		position.y = 0
	}

	const slotBoxHeight = event.rect.height
	if (!slotBoxHeight) return

	const TOTAL_SLOTS = document.getElementsByClassName("slot").length

	// 	reassign ids
	reAssignIds(event)
	
	// 	merge neighbouring slots
	//mergeSlots(TOTAL_SLOTS, SLOT_BOX_HEGHT)
}