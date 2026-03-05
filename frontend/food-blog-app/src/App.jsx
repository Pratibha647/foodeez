import React from 'react'
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import MainNavigation from './components/MainNavigation';
import AddFoodRecipe from './pages/AddFoodRecipe';
import RecipeDetail from './pages/RecipeDetail';
import MyRecipe from './pages/MyRecipe';
import FavRecipe from './pages/FavRecipe';
import EditRecipe from './pages/EditRecipe';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetail /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/myRecipe", element: <MyRecipe /> },
      { path: "/favRecipe", element: <FavRecipe /> },
    ]
  }
]);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
