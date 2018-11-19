import UserService, { IJwtPayload } from "../services/user";

export function authorize(req, res, next): void {
    const token = req.headers["x-access-token"];

    if (!token) {
        res.status(400).send({
            status: "ERROR",
            message: "No auth token found in 'x-access-token'",
            result: token,
        });
    }

    let payload: IJwtPayload;
    UserService.verifyToken(token)
    .then((jwtPayload) => {
        payload = jwtPayload;
        return UserService.get(payload.id);
    })
    .then((user) => {
        if (user.sessionHash === payload.sessionHash) {
            req.user = user;
            req.payload = payload;
            next();
        } else {
            res.status(400).send({
                status: "ERROR",
                message: "Session hash did not match",
                result: null,
            });
        }
    })
    .catch((error) => {
        res.status(500).send({
            status: "ERROR",
            message: "Something went wrong",
            result: error,
        });
    });
}
