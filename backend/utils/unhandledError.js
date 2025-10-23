export const unhandledError = (err, message, server) => {
  console.log(`${message} Shutting down...`)
  console.log(err)
  server
    ? server.close(() => {
        process.exit(1)
      })
    : process.exit(1)
}
