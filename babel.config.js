module.exports = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          chrome: "57",
          firefox: "52",
          safari: "10.3",
          edge: "16",
          opera: "44"
        }
      }
    ],
    "@babel/preset-react"
  ],
  plugins: [
    // automatically generate a global id for each defaultMessage
    [
      "react-intl-auto",
      {
        filebase: false
      }
    ],
    // extract all of the messages to JSON files to ./build/messages
    [
      "react-intl",
      {
        messagesDir: "./build/messages/"
      }
    ]
  ]
};
