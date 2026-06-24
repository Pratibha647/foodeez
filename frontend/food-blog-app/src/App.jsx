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
import { CartProvider } from './context/CartContext';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import CategoryRecipes from './pages/CategoryRecipes';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetail /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/category/:categoryName", element: <CategoryRecipes /> },
      { path: "/myRecipe", element: <MyRecipe /> },
      { path: "/favRecipe", element: <FavRecipe /> },
      { path: "/cart", element: <Cart /> },
      { path: "/profile", element: <Profile /> },
      { path: "/profile/:id", element: <Profile /> },
      { path: "/editProfile", element: <EditProfile /> },
    ]
  }
]);

export default function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>
  );
}
