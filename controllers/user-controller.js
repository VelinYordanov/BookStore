module.exports = (app, userService) => {
    app.get('/profile', async (req, res) => {
        if (!req.user) {
            res.redirect('/login');
        }

        const { id } = req.user;

        const userData = await userService.getUserData(id);
        res.render('user/profile', userData);
    })
}