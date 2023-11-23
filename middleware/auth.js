export default function ({ store, app, route, redirect }) {
  if (route.path === "/timer") {
    //  we are on a protected route
    if (app.$fire.auth.currentUser == null) {
      //take them to sign in page
      return redirect("/");
    } else {
      // return redirect("admin/dashboard");
    }
  }

}
