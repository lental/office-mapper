package main

import (
	"fmt"
	"github.com/gorilla/context"
	"log"
	"net/http"
	"office-mapper/config"
	"office-mapper/handlers"
	"office-mapper/panichandler"
	"runtime"
	"time"
)

func main() {
	ncpu := runtime.NumCPU()
	log.Println("Starting app with GOMAXPROCS = ", ncpu)
	runtime.GOMAXPROCS(ncpu)

	// Build the stack of handlers
	appHandlers := handlers.AppHandlers()
	panicHandler := panichandler.NewHandler(appHandlers)
	timeoutHandler := http.TimeoutHandler(panicHandler, 60*time.Second, "Request Timed Out")
	clearContextHandler := context.ClearHandler(timeoutHandler)

	addr := fmt.Sprintf(":%d", config.Settings.HTTPPort)

	server := &http.Server{
		Addr:    addr,
		Handler: clearContextHandler,
	}
	log.Println("Now listening on " + addr)
	log.Fatalf(server.ListenAndServe().Error())
}
