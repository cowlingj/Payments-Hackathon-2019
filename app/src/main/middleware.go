package main

import "fmt"
import "net/http"
import "time"
import "io/ioutil"
import "os"

type middleware = func(next http.HandlerFunc) http.HandlerFunc

func log(next http.HandlerFunc) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {

		fmt.Printf(
			"%s %s %s\n",
			time.Now().Format("15:04:05"),
			req.Method,
			req.URL.String())

		next(res, req)
	}
}

func timer(next http.HandlerFunc) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		var before = time.Now()
		next(res, req)
		var after = time.Now()
		fmt.Printf("request took: %.3fs\n", after.Sub(before).Seconds())
	}
}

func staticFile(filename string) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		body, err := ioutil.ReadFile("src/static/" + filename)
		if err != nil {
			fmt.Fprintln(os.Stderr, err)
			http500(res, req)
			return
		}
		res.Write(body)
	}
}
