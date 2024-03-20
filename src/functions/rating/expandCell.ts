export default function () {
  const tbody = document.querySelector('.vue3-easy-data-table__body')

  const mouseover = (event: Event) => {
    const td = (event.target as HTMLElement)?.closest('td')
    if (
      td?.children[0] &&
      td.children[0].classList.contains('account') &&
      td.clientWidth < td.scrollWidth
    ) {
      const { top, left } = td.getBoundingClientRect()
      const newTd = td.cloneNode(true) as HTMLElement
      newTd.classList.add('td-over')
      newTd?.setAttribute(
        'style',
        `top: ${top + window.scrollY - 1}px; left: ${left + window.scrollX - 1}px`,
      )
      newTd?.children[0].setAttribute('style', 'max-width: none')
      newTd.dataset.clone = ''
      document.body.append(newTd)
    }
  }
  tbody?.addEventListener('pointerover', mouseover)

  const removeClones = (event: Event) => {
    const pointerEvent = event as PointerEvent
    const newTds = document.querySelector('[data-clone]')
    if (!newTds) return
    const point = document.elementFromPoint(pointerEvent.clientX, pointerEvent.clientY)
    const newTd2 = point?.closest('[data-clone]')
    if (newTd2 != newTds) {
      newTds.remove()
    }
  }

  const removeClones2 = () => {
    const newTds = document.querySelector('[data-clone]')
    newTds?.remove()
  }

  document.addEventListener('pointermove', removeClones)
  document.addEventListener('touchend', removeClones2)
  document.addEventListener('touchmove', removeClones2)
  document.addEventListener('scroll', removeClones2)
}
