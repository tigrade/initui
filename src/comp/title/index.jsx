import {useEffect } from 'react'

// function useDSTitle(title, prevailOnUnmount = false) {
//   const defaultTitle = useRef(document.title);

//   useEffect(() => {
//     document.title = title;
//   }, [title]);

//   useEffect(() => () => {
//     if (!prevailOnUnmount) {
//       document.title = defaultTitle.current;
//     }
//   }, [])
// }

// export default useDSTitle



export default function useTitle(title) {
    console.log(title);
    debugger;
    useEffect(() => {
      const prevTitle = document.title
      document.title = title
      return () => {
        document.title = prevTitle
      }
    })
  }