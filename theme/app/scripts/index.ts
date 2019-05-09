import {onLoad} from "./load";
import {highlight} from "./highlight";
import {menu} from "./menu";
import {navbar} from "./navbar";
import {tabs} from "./tabs";

onLoad(highlight);
onLoad(menu);
onLoad(navbar);
onLoad(() => tabs(".cv"));

