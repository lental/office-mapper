PROJECT_ROOT := $(shell pwd)
PROJECT_NAME := office-mapper
BIN_NAME := $(PROJECT_NAME)
VENDOR_PATH  := $(PROJECT_ROOT)/vendor
GOPATH := $(PROJECT_ROOT):$(VENDOR_PATH)
export GOPATH
PKG := $(PROJECT_ROOT)/pkg

all: build

clean:
	@rm -rf bin pkg package $(VENDOR_PATH)/bin $(VENDOR_PATH)/pkg

init: clean
	@mkdir bin

run: build
	bin/$(BIN_NAME)

build: init
	@go build -o bin/$(BIN_NAME) $(BIN_NAME).go

package: build
	@cp -r bin package
	@cp -r templates package
	@cp -r static package

dep:
	@git submodule update --init


test: clean
ifdef TEST_PACKAGE
		@echo "Testing $$TEST_PACKAGE..."
		@go test -i $$TEST_PACKAGE
		@go test $$TEST_PACKAGE
else
		@cd $(PROJECT_ROOT)
		@for p in `find . -path ./vendor -prune -o -type f -name "*test.go" -print | sort -u`; do \
			echo "Testing $$p..."; \
			go test $$p -i || exit 1;\
			go test || exit 1;\
		done
endif

fmt:
	@find . -path ./vendor -prune -o -name "*.go" \
	-exec gofmt -s -l -w {} \;
