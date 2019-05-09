---
title: "Add total pages to Google Slides"
date: 2018-02-06
categories:
  - Development
---

**Upd.** Все таки пользоваться серьезно google slides нельзя, нету кучу возможностей, и в самолете слайды не можешь поредактировать. Перешел на [Impress](https://www.libreoffice.org/discover/impress/).

Google Slides неплохой вариант для создания строгих презентаций. В целом это законченный, полноценный продукт, но все-таки у него есть несколько проблем. Одна из проблем о которой сейчас пойдет речь - невозможность показывать общее количество слайдов.

Решать мы будем с помощью [Google Apps Script](https://script.google.com/home). 

И так, сначала по шагам, а потом рассмотрим подробнее интересные моменты:

1. Открываем/создаем Google Slides;
2. **Tools** -> **Script Editor...**;
3. В окно редактора вставляем следующий код:
    ```javascript
    function onInstall(e) {
      onOpen();
    }
    
    function onOpen(e) {
      const ui = SlidesApp.getUi().createAddonMenu()
        .addItem("Update page count", "pageCount")
        .addToUi();
    }
    
    function pageCount() {
      const slides = SlidesApp
        .getActivePresentation();
      
      const totalPages = slides.getSlides().length;
      
      slides.getSlides().forEach(function (slide, idx) {
        slide.getShapes()
          .filter(function (element) {
            return element.getText && element.getText().find("Slide [0-9]+\/[0-9]+").length > 0
          })
          .forEach(function (element) {      
            return element.getText().setText(Utilities.formatString("Slide %s/%s", idx + 1, totalPages));
          });
      });
    }
    ```    
4. Теперь на слайдах вставляем в нужном месте текстовый блок с содержимым: "Slide 0/0";
5. И вызываем скрипт из **Add-ons** -> **Page Count** -> **Update page count**.

Если у вас на слайдах другой текст (не `Slide 1/100`) то замените соответсвующий regex.
В целом это не полноценное решение, но достаточно простое и самое главное - рабочее. Также вы можете посмотреть на доступный [API](https://developers.google.com/apps-script/reference/slides/) и пример похожего дополнения/скрипта: [Progress Bar Add-on](https://developers.google.com/apps-script/guides/slides/samples/progress-bar).

Из интересных вещей - скрипты могут вызываться по http (и имеют сами доступ к http клиенту), могут получать параметры из запроса и автоматизировать работу с множеством сервисов гугла: Calendar, Contacts, Documents, Drive, Forms, Gmail, Groups, Language, Maps, Sites, Slides и Spreadsheets.

Возможно я разберусь с публикацией этого скрипта в стор и сделаю его более общим. Но пока - пока.

<video controls src="./google-slides-count.webm"></video>
