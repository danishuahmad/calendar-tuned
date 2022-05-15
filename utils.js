function getOffset(el) {
	let _x = 0;
	let _y = 0;
	while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
		_x += el.offsetLeft - el.scrollLeft;
		_y += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	}
	return {
		y: _y,
		x: _x,
	};
}
function getDimensions(element) {
	let width, height = 0;
	if (element) {
		width = element.offsetWidth
		height = element.offsetHeight
	}
	return { width, height }
}
function getNumberFromId(id) {
	try{
		const idArray = id.split("-")
		return idArray.pop()
	}catch(e){
		return 0
	}

	let width, height = 0;
	if (element) {
		width = element.offsetWidth
		height = element.offsetHeight
	}
	return { width, height }
}
function getOuterHtml(node) {
    var parent = node.parentNode;
    var element = document.createElement(parent.tagName);
    element.appendChild(node);
    var html = element.innerHTML;
    parent.appendChild(node);
    return html;
}
function reAssignIds(event) {
	let { x, y } = event.target.dataset
	//console.log("EVENT CALLED", x, y)
	//	recalculate slot box id
	let repositionY = getTranslateYValue(event.target.style.transform)
	if( isNaN(repositionY) ){
		repositionY=0
	}
	const oldIdNumber = Number(event.target.getAttribute(SLOT_BOX_ATTR))
	const newIdNumber = oldIdNumber + (repositionY / SLOT_BOX_HEGHT);

	//	check if no change in id number
	if( newIdNumber === oldIdNumber ){
		return
	}

	//	check if another slot already exists
	const existingSlotBox = document.querySelectorAll(`[${SLOT_BOX_ATTR}='${newIdNumber}']`)[0]
	//console.log(event,existingSlotBox,repositionY)

	if( existingSlotBox ){
		const existingSlotBoxHeight = parseInt(existingSlotBox.style.height)
		const currentSlotBoxHeight = parseInt(event.target.style.height)
		if( existingSlotBoxHeight < currentSlotBoxHeight ){
			removeSlotBox(existingSlotBox);
		}else{
			removeSlotBox(event.target);
			return;
		}
	}
	console.log({newIdNumber, repositionY, oldIdNumber});

	//	move to its designated new slot
	const clone = event.target.cloneNode(true);
	clone.setAttribute(SLOT_BOX_ATTR, newIdNumber);
	clone.id = "slot-box-" + newIdNumber;
	clone.style.top = parseInt(clone.style.top)+repositionY+"px"
	clone.style.transform = null;
	clone.innerHTML = `<div class="handle-container"><div id="handle-top-${newIdNumber}" class="slot-box-handle handle-top"></div>
  <div id="handle-bottom-${newIdNumber}" class="slot-box-handle handle-bottom"></div></div>`
	removeSlotBox(event.target);
	const parent = document.getElementById(`slot-${newIdNumber}`);
	parent.appendChild(clone);

	return

	for (let i = 0; i < totalSlots; i++) {

		const indexedSlotBox = document.querySelectorAll(`[${SLOT_BOX_ATTR}='${i}']`)[0]
		console.log({indexedSlotBox})
		if (indexedSlotBox) {

			let repositionY = getTranslateYValue(indexedSlotBox.style.transform)
			if (isNaN(repositionY)) {
				repositionY = 0
			}
			//	get indexed slotbox metadata
			const newIdNumber = i + (repositionY / slotBoxHeight);
			console.log({i,newIdNumber, repositionY})
			if(i>0) return
			const indexedSlotBoxHeight = parseInt(indexedSlotBox.style.height);
			const newEndingIndexedSlotBox = (newIdNumber-1) + (indexedSlotBoxHeight/slotBoxHeight);
			const currentSlotNumber = indexedSlotBox.getAttribute(SLOT_BOX_ATTR)

			if( newIdNumber != currentSlotNumber ){
				const clone = indexedSlotBox.cloneNode(true);
				clone.setAttribute(SLOT_BOX_ATTR, newIdNumber);
				clone.id = "slot-box-" + newIdNumber;
				console.log({top: parseInt(clone.style.top), repositionY, gesamt: parseInt(clone.style.top)+repositionY })
				clone.style.top = parseInt(clone.style.top)+repositionY+"px";
				console.log(clone.style.top)
				clone.style.transform = null;
				removeSlotBox(indexedSlotBox);

				const parent = document.getElementById(`slot-${newIdNumber}`);

				//	check if another slotbox is overlapping
				for (let j = newIdNumber; j <= newEndingIndexedSlotBox; j+=1) {
					const existingSlotBox = document.querySelectorAll(`[${SLOT_BOX_ATTR}='${j}']`)[0];
					if (existingSlotBox) {
						//	get existing slotbox starting and ending point
						const existingSlotBoxHeight = parseInt(existingSlotBox.style.height)
						const existingSlotBoxEndingOn = (j + (existingSlotBoxHeight/slotBoxHeight));

						if( newEndingIndexedSlotBox < existingSlotBoxEndingOn ){
							clone.style.height = (((existingSlotBoxEndingOn) - newIdNumber) * slotBoxHeight) + "px"
						}
						removeSlotBox(existingSlotBox);
						break;
					}
				}
				parent.appendChild(clone);
			}
			break;
			//	check all slots from new position to old if another slot box exists
			// let allSlotsChecked = false;
			// let slotNumberToCheck = newIdNumber;
			// while( !allSlotsChecked ){
			// 	const existingSlotBox = document.getElementById("slot-box-" + newIdNumber);	
			// 	if( existingSlotBox && newIdNumber !== i ){
			// 		console.log({newIdNumber})
			// 		const indexedSlotBoxHeight = parseInt(indexedSlotBox.style.height)
			// 		const existingSlotBoxHeight = parseInt(existingSlotBox.style.height)

			// 		//	check if the first slot
			// 		if( slotNumberToCheck === newIdNumber ){
			// 			//	keep the bigger one and delete the other one
			// 			if( existingSlotBoxHeight > indexedSlotBoxHeight ){
			// 				removeSlotBox(indexedSlotBox);
			// 				break;
			// 			}else{
			// 				removeSlotBox(existingSlotBox);
			// 				indexedSlotBox.id = "slot-box-"+newIdNumber;
			// 				break;
			// 			}
			// 		}else if( slotNumberToCheck > newIdNumber ) {

			// 			const newEndingIndexedSlotBox = newIdNumber + indexedSlotBoxHeight

			// 			const existingSlotBoxStartingFrom = parseInt(existingSlotBox.id)
			// 			const existingSlotBoxEndingOn = parseInt(existingSlotBox.id)

			// 			//	overlapping with the next one
			// 			if( (newEndingIndexedSlotBox > existingSlotBoxStartingFrom) && (newEndingIndexedSlotBox < existingSlotBoxEndingOn ) ){
			// 				console.log("DANIsh")

			// 				//  merge
			// 				indexedSlotBox.style.height = ((existingSlotBoxEndingOn - newIdNumber) * slotBoxHeight) + "px"
			// 				indexedSlotBox.id = "slot-box-"+newIdNumber;
			// 				removeSlotBox(existingSlotBox)
			// 			}

			// 			// const existingSlotBoxEndingSlotNumber = slotNumberToCheck + (existingSlotBox.style.height / slotBoxHeight);
			// 			// const indexedSlotBoxEndingSlotNumber = newIdNumber + (existingSlotBox.style.height / slotBoxHeight);
			// 			// if( existingSlotBoxEndingSlotNumber > indexedSlotBoxEndingSlotNumber ){
			// 			// 	indexedSlotBox.style.height = ((existingSlotBoxEndingSlotNumber - newIdNumber) * slotBoxHeight) + "px";
			// 			// }
			// 			// console.log({existingSlotBox})
			// 			// removeSlotBox(existingSlotBox);
			// 		}else {
			// 			const indexedSlotBoxEndingSlotNumber = newIdNumber + (existingSlotBox.style.height / slotBoxHeight);
			// 			const existingSlotBoxEndingSlotNumber = slotNumberToCheck + (existingSlotBox.style.height / slotBoxHeight);
			// 			if( indexedSlotBoxEndingSlotNumber > existingSlotBoxEndingSlotNumber ){
			// 				existingSlotBox.style.height = ((indexedSlotBoxEndingSlotNumber - slotNumberToCheck) * slotBoxHeight) + "px";
			// 			}
			// 			console.log({indexedSlotBox})
			// 			removeSlotBox(indexedSlotBox);
			// 		}					

			// 	}
			// 	if( slotNumberToCheck === i ){
			// 		allSlotsChecked = true
			// 	}else if( slotNumberToCheck > i ){
			// 		slotNumberToCheck--; 
			// 	}else{
			// 		slotNumberToCheck++;
			// 	}
			// 	console.log({slotNumberToCheck, currentIdNumber: i, allSlotsChecked})

			// }

		}

	}
}
function mergeSlots(totalSlots, slotBoxHeight) {
	for (let i = 0; i < totalSlots; i++) {
		const indexedSlotBox = document.getElementById("slot-box-" + i)
		if (indexedSlotBox) {
			//  get height
			const indexedSlotBoxHeight = parseFloat(indexedSlotBox.style.height)
			//  get neighbouring slot number
			const nextSlotNumber = i + (indexedSlotBoxHeight / slotBoxHeight)

			//  check if there is something on the next slot 
			const nextSlotBox = document.getElementById("slot-box-" + nextSlotNumber)
			if (nextSlotBox) {
				//  get height
				const nextSlotBoxHeight = parseFloat(nextSlotBox.style.height)

				//  merge
				indexedSlotBox.style.height = (indexedSlotBoxHeight + nextSlotBoxHeight) + "px"
				removeSlotBox(nextSlotBox)
			}
		}
	}
}
function getTranslateXValue(translateString) {

	var n = translateString.indexOf("(");
	var n1 = translateString.indexOf(",");

	var res = parseInt(translateString.slice(n + 1, n1 - 2));

	return res;

}
function getTranslateYValue(translateString) {

	var n = translateString.indexOf(",");
	var n1 = translateString.indexOf(")");

	var res = parseInt(translateString.slice(n + 1, n1 - 1));
	return res;

}
function removeSlotBox(target) {
	interact(target).unset()
	target.remove()
}