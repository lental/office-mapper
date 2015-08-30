// Package panichandler wraps the app handlers to catch any panics.
// It returns an Internal Server Error for panics instead of the default emtpy response.
package panichandler

import (
	"net/http"
)

type Handler struct {
	handler http.Handler
}

func NewHandler(h http.Handler) *Handler {
	return &Handler{h}
}

func (h *Handler) ServeHTTP(rw http.ResponseWriter, r *http.Request) {
	defer func() {
		if e := recover(); e != nil {
			rw.WriteHeader(http.StatusInternalServerError)
			rw.Write([]byte("Internal Server Error"))
		}
	}()
	h.handler.ServeHTTP(rw, r)
}
