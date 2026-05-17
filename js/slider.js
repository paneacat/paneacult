/* =========================
       SLIDER
    ========================= */

    const slider =
      document.getElementById(
        "slider"
      );

    const next =
      document.getElementById(
        "next"
      );

    const prev =
      document.getElementById(
        "prev"
      );

    if(slider && next && prev){

      function updateArrows(){

        const maxScroll =
          slider.scrollWidth -
          slider.clientWidth;

        if(
          slider.scrollLeft >=
          maxScroll - 10
        ){

          prev.style.opacity = "1";

          prev.style.pointerEvents =
            "auto";

        }

        else {

          prev.style.opacity = "0";

          prev.style.pointerEvents =
            "none";

        }

      }

      next.addEventListener(
        "click",
        () => {

          slider.scrollBy({

            left:
              slider.clientWidth,

            behavior:
              "smooth"

          });

        }
      );

      prev.addEventListener(
        "click",
        () => {

          slider.scrollTo({

            left: 0,

            behavior:
              "smooth"

          });

        }
      );

      slider.addEventListener(
        "scroll",
        updateArrows
      );

      updateArrows();

    }

   
