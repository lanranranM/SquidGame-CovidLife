A small present!

The web version of *SquidGame in CovidLife*.


### Run the game

#### Run on a server

First, deployment: Upload the entire folder to your site. If you are using GitHub Pages, add the entire folder to the corresponding repository and commit. You only need to deploy it once.

Then, access the game with `<your-url>/<folder-name>`. For example, if your site's URL is `https://example.cc` and the game folder's name is "squidgame", then the link for the game is `https://example.cc/squidgame`.

#### Run locally

Due to Chrome's file protocol restriction, we cannot directly open `index.html`. Follow this guide to run the game on your machine.

First, make sure you have two things installed (I'm sure you have):

1. **node.js**: download from https://nodejs.org/en/

2. **http-server**: after node.js is installed, open a terminal, type

   ```shell
   npm install -g http-server
   ```

You only need to install these two things once.

Then, open a terminal at this folder, and type `http-server`. Find something like this in the terminal:

```shell
Available on:
  http://192.168.96.1:8080
  http://192.168.0.105:8080
  http://192.168.177.1:8080
  http://192.168.79.1:8080
  http://127.0.0.1:8080
Hit CTRL-C to stop the server
```

Then access the game using one of these links.

### Some words
The game itself is fun and meaninful in various ways. What's more meaningful is the process of writing it. I learned class inheritance in JavaScript and the mechanism of *this* context.

Phaser is a wonderful engine just like PyGame. It saves me from piles of details and tons of JavaScript loopholes. As I write more frontend projects, I become increasingly certain that JavaScript sucks. That's why engines and frameworks like Phaser, React and Vue are so important: They literally save life.