package main

import(
	"fmt"
	"net/http"
	"os"
	"io/ioutil"
	"regexp"
	"path/filepath"
	"encoding/json"
	"math/rand"
	"time"
	"strings"
)

type Payment struct {
	Amount float64 `json: "amount"`
	Key string `json: "key"`
}

func (this *Payment) String() string {
	retval, _ := json.Marshal(this)
	return string(retval)
}

func randStr(length int) string {
	chars := []rune("ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ" +
    "abcdefghijklmnopqrstuvwxyzåäö" +
    "0123456789")
	var b strings.Builder
	for i := 0; i < length; i++ {
	    b.WriteRune(chars[rand.Intn(len(chars))])
	}
 return b.String()
}

var assignedKey = randStr(256)

func resetKey(res http.ResponseWriter, req *http.Request) {
	assignedKey = randStr(256)
	res.Write([]byte(assignedKey))
}

func pay(res http.ResponseWriter, req *http.Request) {
	rand.Seed(time.Now().UnixNano())
	
	var payment Payment

	err := json.NewDecoder(req.Body).Decode(&payment)
	if (err != nil) {
		res.Write([]byte("/failed"))
		return
	}

	if (payment.Key != assignedKey) {
		res.Write([]byte("/failed"))
		return
	}

	res.Write([]byte("/success"))
}


var staticRegex = regexp.MustCompile("^/static/(.+)")
func static(res http.ResponseWriter, req *http.Request) {
	var match = staticRegex.FindSubmatch([]byte(filepath.Clean(req.URL.Path)))

	if (len(match) != 2) {
		http404(res, req)
		return
	}

	var path = string(match[1])
	if (path == "") {
		http404(res, req)
		return
	}

	body, err := ioutil.ReadFile("src/static/" + path)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		http500(res, req)
		return
	}
	res.Write(body)
}

func http404(res http.ResponseWriter, req *http.Request) {
	http.Error(res, "This is not the page you are looking for", http.StatusNotFound)
}

func http500(res http.ResponseWriter, req *http.Request) {
	http.Error(res, "Oops! something went wrong", http.StatusInternalServerError)
}
