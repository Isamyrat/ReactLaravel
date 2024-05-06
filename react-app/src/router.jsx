import {createBrowserRouter} from "react-router-dom";
import CardBlock from "./views/CardBlock";


const router = createBrowserRouter([

  {
    path: '/',
    element: <CardBlock />,
  },

])


export default router;
