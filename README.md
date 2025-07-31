# Porject Prposal:

Boolean operations (like it works in Figma)
https://www.youtube.com/watch?v=1IebN9pTulE

Task: Implement the four standard Boolean operations

Union
Subtract
Intersect
Exclude
For 2 SVG shapes using TypeScript and suitable for integration into a MobX-based DOM editor.

It should be a reusable module, compatible with React/MobX store usage.

Include a short README or code comment block explaining how your solution works, what libraries you used, and any limitations.

# Preview URL

# [Preview](https://react-paper-js.vercel.app/)


# Notes

The demo is uses

- MOBX for state management.
- Styled Components for styling.
- Paper.js for performing the boolean operations on the shapes.
- React for UI
- vite as build tool

It's a rudamentry implementaion of FIGMA like Boolean intersection opreations. But unlike figma it's a DOM based editor.

> # Overview:

When a shape is spawned, it's added to the Dom node as

- This implements a very Simple intersection Logic To
  check if two shapes are intersecting we check if the bounding boxes of the shapes intersect. If they do intersect we will get the shapes info like size and position and then use paperjs to perform the boolean opreation and create a new shape.

- We only modify the shapes that are selected and are intersecting Even if a shape is selected but not intersecting with any other shape it will not be modified.

- Then we remove the original shapes on which the actions were performed and add the new shape to the DOM.

- This allow us to maintain a simple history of shapes which can be used to undo/redo the operations.

- Modular We can switch the library and the logic used easily currently we use papaer js we pass the shapes to paperjs and return the new shape. If we want to switch to another library we can just change the logic in the `performBooleanOperation` function.

- paper js is pretty efficent and smart at handling the boolean operations. It can scale very well with the number of shapes and the complexity of the shapes.

Workflow

```
-> Add Shapes to dom canvas node
-> Select the shapes to perform boolean operations on
-> Check if the shapes are intersecting using bounding box logic
-> If they are intersecting, if so perform the boolean operation using paperjs
-> Create a new shape with the result of the boolean operation
-> Remove the original shapes from the MOBX store and DOM Update the store with the new shape
-> Add the new shape to the DOM

```

> # Limitation:

- Paperjs is not DOM based. So we need to spawn a hidden canvas to use paperjs for the boolean operations. Once the operation.

- Rudimentary Intersection and Bounding Logic :

The Assignment was about Performing boolean opreation on Shapes So i am using a very simple bounding box intersection logic to check if two shapes are intersecting and resize the shape accordingly.

There can be scenarios where the bounding boxes of two shapes intersect but the shapes themselves do not. This is a limitation of the current simple bounding checks implementation.
