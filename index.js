import { registerRootComponent } from "expo";
import { LogBox } from "react-native";
import App from "./App";

registerRootComponent(App);

LogBox.ignoreLogs([
    'VirtualizedLists should never be nested inside plain ScrollViews',
]);
