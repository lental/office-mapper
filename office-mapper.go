package main

import (
	"fmt"
	"github.com/gorilla/context"
	"log"
	"net/http"
	"office-mapper/config"
	"office-mapper/handlers"
	"office-mapper/panichandler"
	"ooyala/go-ooyala-headers"
	"ooyala/go-ooyalalog"
	"os"
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
	ooyalaHeaderHandler := ooheaders.NewHandler(timeoutHandler)
	logHandler := ooyalalog.NewHandler(ooyalaHeaderHandler, os.Stdout, []string{"/healthz"})
	clearContextHandler := context.ClearHandler(logHandler)

	addr := fmt.Sprintf(":%d", config.Settings.HTTPPort)

	server := &http.Server{
		Addr:    addr,
		Handler: clearContextHandler,
	}
	log.Println("Now listening on " + addr)
	log.Fatalf(server.ListenAndServe().Error())
}
