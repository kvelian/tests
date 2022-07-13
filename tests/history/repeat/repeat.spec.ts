import {test, Page, expect} from '@playwright/test';
import {IDS} from "@constants/ids";
import {getById, getIdFormatted, waitRequest, addAuthCookie} from "@helpers";
import {snapshot} from "../../../utils/helpers/snapshot";
import {PATHES} from "@constants/tests";

