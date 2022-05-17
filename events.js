function onDayClick(dayNumber){
	focusDay(dayNumber);
}

function initialRender(){

	focusDay(0);

	const slots = [{fromHour: 0, toHour: 2}, {fromHour: 5, toHour: 10}, {fromHour: 12, toHour: 16}, {fromHour: 18, toHour: 23}];
	
	for( let i=0; i<slots.length; i++ ){
		const slot = slots[i];

		const clickedElement = document.getElementById("slot-" + slot.fromHour);
		const borderLineElement = document.getElementById("border-line-" + slot.fromHour);

		const slotOffsetData = getOffset(clickedElement)
		const lineOffsetData = getOffset(borderLineElement)
		const lineDimensionsData = getDimensions(borderLineElement)

		const newElement = document.createElement('div');
		newElement.setAttribute("id", "slot-box-" + slot.fromHour);
		newElement.setAttribute("class", "resizable-slot-box");
		newElement.setAttribute(SLOT_BOX_ATTR, slot.fromHour);
	
		newElement.style.width = lineDimensionsData.width + "px";
		newElement.style.top = slotOffsetData.y + "px";
		newElement.style.left = lineOffsetData.x + "px";
		newElement.style.height = ((slot.toHour - slot.fromHour)*SLOT_BOX_HEGHT)+"px";
		//  add handle (dots) in border line
		newElement.innerHTML = `<div class="handle-container"><div id="handle-top-${slot.fromHour}" class="slot-box-handle handle-top"></div>
	  <div id="handle-bottom-${slot.fromHour}" class="slot-box-handle handle-bottom"></div></div>`
	
		clickedElement.append(newElement);

	}
}
function onSlotClick(index) {
	index = Number(index)
	//  check if slot already box already created for given index
	if (document.querySelectorAll(`[${SLOT_BOX_ATTR}='${index}']`).length) {
		return
	}
	//	check immediate previous neighbour
	for (let i = 0; i < index; i++) {
		
		const existingSlotBox = document.querySelectorAll(`[${SLOT_BOX_ATTR}='${i}']`)[0]
		if (existingSlotBox) {
			//  get height
			const existingSlotBoxHeight = parseFloat(existingSlotBox.style.height)
			const nextSlotNumber = i + (existingSlotBoxHeight / SLOT_BOX_HEGHT)
			if (nextSlotNumber === index) {

				//  check if sandwich merge
				const nextToNextSlotBox = document.querySelectorAll(`[${SLOT_BOX_ATTR}='${index+1}']`)[0]
				if (nextToNextSlotBox) {
					//  sandwich merge
					const nextToNextSlotBoxHeight = parseFloat(nextToNextSlotBox.style.height)
					existingSlotBox.style.height = (existingSlotBoxHeight + SLOT_BOX_HEGHT + nextToNextSlotBoxHeight) + "px"
					removeSlotBox(nextToNextSlotBox)
				} else {
					//  simple merge
					existingSlotBox.style.height = (existingSlotBoxHeight + SLOT_BOX_HEGHT) + "px"
				}

				return
			}
		}
	}


	const clickedElement = document.getElementById("slot-" + index)
	const borderLineElement = document.getElementById("border-line-" + index)

	const slotOffsetData = getOffset(clickedElement)
	const lineOffsetData = getOffset(borderLineElement)
	const lineDimensionsData = getDimensions(borderLineElement)

	const newElement = document.createElement('div');
	newElement.setAttribute("id", "slot-box-" + index);
	newElement.setAttribute("class", "resizable-slot-box");
	newElement.setAttribute(SLOT_BOX_ATTR, index);

	newElement.style.width = lineDimensionsData.width + "px";
	//	check if next neightbour exists
	const nextNeighbour = document.querySelectorAll(`[${SLOT_BOX_ATTR}='${index+1}']`)[0]
	if( nextNeighbour ){
		const nextSlotBoxHeight = parseFloat(nextNeighbour.style.height);
		newElement.style.height = SLOT_BOX_HEGHT+nextSlotBoxHeight+"px";
		removeSlotBox(nextNeighbour);
	}else{
		newElement.style.height = SLOT_BOX_HEGHT + "px";
	}
	newElement.style.top = slotOffsetData.y + "px";
	newElement.style.left = lineOffsetData.x + "px";
	//  add handle (dots) in border line
	newElement.innerHTML = `<div class="handle-container"><div id="handle-top-${index}" class="slot-box-handle handle-top"></div>
  <div id="handle-bottom-${index}" class="slot-box-handle handle-bottom"></div></div>`

	clickedElement.append(newElement);
}

function onSaveClick() {
	const slotBoxes = document.getElementsByClassName('resizable-slot-box');

	const hours = []

	for( let i=0; i<slotBoxes.length; i++ ){
		const slotBox = slotBoxes[i];
		const fromHour = Number(slotBox.getAttribute(SLOT_BOX_ATTR));
		const toHour = ((parseFloat(slotBox.style.height)/SLOT_BOX_HEGHT)-1)+fromHour;
		hours.push({fromHour, toHour});
	}
	console.log(hours)
}