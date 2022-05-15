function onSlotClick(index) {
	index = Number(index)
	//  check if slot already box already created for given index
	if (document.querySelectorAll(`[${SLOT_BOX_ATTR}='${index}']`).length) {
		return
	}
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
	newElement.style.height = SLOT_BOX_HEGHT + "px";
	newElement.style.top = slotOffsetData.y + "px";
	newElement.style.left = lineOffsetData.x + "px";
	//  add handle (dots) in border line
	newElement.innerHTML = `<div class="handle-container"><div id="handle-top-${index}" class="slot-box-handle handle-top"></div>
  <div id="handle-bottom-${index}" class="slot-box-handle handle-bottom"></div></div>`

	clickedElement.append(newElement);

}