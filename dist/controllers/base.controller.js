"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    /**
     * Returns success (200)
     * @param res
     * @param msg
     * @param data
     */
    respondSuccess(res, msg, data) {
        return res.status(200).send({
            msg: msg !== null && msg !== void 0 ? msg : null,
            data: data !== null && data !== void 0 ? data : null,
        });
    }
    /**
     * Returns not found (404)
     * @param res
     * @param error
     */
    respondNotFound(res, error) {
        return res.status(404).send({
            msg: error !== null && error !== void 0 ? error : null,
            data: null,
        });
    }
    /**
     * Returns error (500)
     * @param res
     * @param error
     */
    respondServerError(res, error) {
        return res.status(500).send({
            msg: error !== null && error !== void 0 ? error : `Unexpected error occurred`,
            data: null,
        });
    }
    /**
     * Returns invalid (400)
     * @param res
     * @param error
     */
    respondInvalid(res, error) {
        return res.status(400).send({
            msg: null,
            data: null,
            error: error !== null && error !== void 0 ? error : null,
        });
    }
    /**
     * Returns unauthorized (401)
     * This is when a client is not signed in, or has invalid credentials
     *
     * @param res
     * @param error
     */
    respondUnauthorized(res, error) {
        return res.status(401).send({
            msg: error !== null && error !== void 0 ? error : null,
            data: null,
        });
    }
    /**
     * Returns forbidden (403)
     * This is when a client is signed in, but doesn't have enough privileges
     *
     * @param res
     * @param error
     */
    respondForbidden(res, error) {
        return res.status(403).send({
            msg: error !== null && error !== void 0 ? error : null,
            data: null,
        });
    }
    /**
     * Returns resource already exists (409)
     * @param res
     * @param error
     */
    respondResourceExists(res, error) {
        return res.status(409).send({
            msg: error !== null && error !== void 0 ? error : null,
            data: null,
        });
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=base.controller.js.map