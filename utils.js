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
function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
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
	//	recalculate slot box id
	let repositionY = getTranslateYValue(event.target.style.transform)
	if( isNaN(repositionY) ){
		repositionY=0
	}
	const oldIdNumber = Number(event.target.getAttribute(SLOT_BOX_ATTR))
	const newIdNumber = oldIdNumber + (repositionY / SLOT_BOX_HEGHT);

	//	check if no change in id number
	if( newIdNumber === oldIdNumber ){
		return oldIdNumber
	}

	//	check if another slot already exists
	const existingSlotBox = document.querySelectorAll(`[${SLOT_BOX_ATTR}='${newIdNumber}']`)[0]

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
	return newIdNumber
}
function mergeSlots(idNumber) {
	
	idNumber = Number(idNumber)

	//	get current slot
	const currentSlot = document.querySelectorAll(`[${SLOT_BOX_ATTR}='${idNumber}']`)[0];
	const currentSlotBoxHeight = parseFloat(currentSlot.style.height);

	//	get next neighbour
	const nextNeighbour = document.querySelectorAll(`[${SLOT_BOX_ATTR}='${idNumber+((currentSlotBoxHeight/SLOT_BOX_HEGHT))}']`)[0];
	if( nextNeighbour ){
		const nextSlotBoxHeight = parseFloat(nextNeighbour.style.height);
		currentSlot.style.height = currentSlotBoxHeight+nextSlotBoxHeight+"px";
		removeSlotBox(nextNeighbour);
	}

	//	get previous neighbour
	if( idNumber > 0 ){

		let noMorePreviousNeighours = false;
		let index = idNumber-1;
		while(!noMorePreviousNeighours){
			const previousNeighbour = document.querySelectorAll(`[${SLOT_BOX_ATTR}='${index}']`)[0];
			if( previousNeighbour ){
				const previousSlotBoxHeight = parseFloat(previousNeighbour.style.height);
				if( (previousSlotBoxHeight / SLOT_BOX_HEGHT)+index === idNumber ){
					//	previous ending just before current => MERGE
					previousNeighbour.style.height = previousSlotBoxHeight+currentSlotBoxHeight+"px";
					removeSlotBox(currentSlot);
				}else{	//	there is a gap between previous and current => STOP
					noMorePreviousNeighours = true;
				}
			}else{
				index--;
			}

			if( index < 0 ){	//	end of slots
				noMorePreviousNeighours = true;
			}
			
		}

		
	}
}
function removeOverlaps(idNumber) {
	//	get current slot
	const currentSlot = document.querySelectorAll(`[${SLOT_BOX_ATTR}='${idNumber}']`)[0];
	if( !currentSlot ) return;
	const currentSlotBoxHeight = parseFloat(currentSlot.style.height);
	const currentEndingAt = ((currentSlotBoxHeight / SLOT_BOX_HEGHT)-1)+idNumber

	//	check if any slot overlapping next
	for( let i=idNumber+1; i<=currentEndingAt; i++ ){
		const nextNeighbour = document.querySelectorAll(`[${SLOT_BOX_ATTR}='${i}']`)[0];
		if( nextNeighbour ){
			const nextNeighbourHeight = parseFloat(nextNeighbour.style.height);
			const nextEndingAt = ((nextNeighbourHeight / SLOT_BOX_HEGHT)-1)+i

			if( nextEndingAt <= currentEndingAt ){
				removeSlotBox(nextNeighbour);
			}else{
				currentSlot.style.height = (((nextEndingAt-idNumber)+1)*SLOT_BOX_HEGHT)+"px";
				removeSlotBox(nextNeighbour);
			}
		}
	}

	//	get previous overlap
	if( idNumber > 0 ){

		let noMorePreviousNeighours = false;
		let index = idNumber-1;
		while(!noMorePreviousNeighours){
			const previousNeighbour = document.querySelectorAll(`[${SLOT_BOX_ATTR}='${index}']`)[0];

			if( previousNeighbour ){
				const previousSlotBoxHeight = parseFloat(previousNeighbour.style.height);
				const previousSlotBoxEndingAt = ((previousSlotBoxHeight / SLOT_BOX_HEGHT)-1)+index
				if( previousSlotBoxEndingAt > currentEndingAt ){
					//	previous ending after current => REMOVE CURRENT
					removeSlotBox(currentSlot);
					return;
				}else if( idNumber <= previousSlotBoxEndingAt ){	//	overlap
					previousNeighbour.style.height = (((currentEndingAt-index)+1)*SLOT_BOX_HEGHT)+"px";
					removeSlotBox(currentSlot);
					return;
				}else{	//	there is a gap between previous and current => STOP
					noMorePreviousNeighours = true;
				}
			}else{
				index--;
			}

			if( index < 0 ){	//	end of slots
				noMorePreviousNeighours = true;
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
function focusDay(dayNumber){
	const days = document.getElementsByClassName('day-tab-label');

	for( let i=0; i<days.length; i++ ){
		const day = days[i];	
		Object.assign(day.style, {
			"border": "none",
			"border-radius": "none"
		})
	}

	const focusDay = document.getElementById("day-"+dayNumber);
	Object.assign(focusDay.style, {
		"border": "1px solid #1DC3A7",
		"border-radius": "6px"
	})

}