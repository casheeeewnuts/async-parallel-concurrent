import {expose} from "comlink";
import {fibonacci} from "./fib";

expose({fibonacci})