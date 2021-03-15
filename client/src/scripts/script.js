// (function() {
//     setTimeout(() => {
//         const classActive = 'nav-links-item-active'
//         const navigationLinks = document.querySelectorAll('.link')
//         navigationLinks[0].parentNode.classList.add(classActive)
//         navigationLinks.forEach(item => {
//             item.addEventListener('click', function() {
//                 document.querySelector(`.${classActive}`).classList.remove(classActive)
//                 this.parentNode.classList.add(classActive)
//             })
//         })
//     }, 0)
    
// })()
// try {
//     setTimeout(() => {
//         document.querySelector('#date-picker').datepicker({
//             dateFormat : "yy-mm-dd",
//             // minDate: new Date(document.querySelector('#hiddendelivdate').value),
//             monthNames : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
//             dayNamesMin : ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
//         });
//     }, 4000)
    
// }
// catch (e) {}
