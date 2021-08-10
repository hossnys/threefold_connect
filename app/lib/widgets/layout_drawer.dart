import 'package:flutter/material.dart';
import 'package:threebotlogin/events/events.dart';
import 'package:threebotlogin/events/go_home_event.dart';
import 'package:threebotlogin/events/go_news_event.dart';
import 'package:threebotlogin/events/go_planetary_event.dart';
import 'package:threebotlogin/events/go_reservations_event.dart';
import 'package:threebotlogin/events/go_settings_event.dart';
import 'package:threebotlogin/events/go_support_event.dart';
import 'package:threebotlogin/events/go_wallet_event.dart';
import 'package:threebotlogin/helpers/globals.dart';

class LayoutDrawer extends StatefulWidget {
  LayoutDrawer({@required this.titleText, @required this.content});

  final String titleText;
  final Widget content;

  @override
  _LayoutDrawerState createState() => _LayoutDrawerState();
}

class _LayoutDrawerState extends State<LayoutDrawer> {
  Globals globals = Globals();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        // Here we take the value from the MyHomePage object that was created by
        // the App.build method, and use it to set our appbar title.
        title: Text(widget.titleText),
        backgroundColor: Theme.of(context).primaryColor,
        iconTheme: IconThemeData(color: Colors.white),
        toolbarHeight: 60,
      ),
      body: widget.content,
      drawer: Drawer(
        elevation: 5,
        // space to fit everything.
        child: ListView(
          // Important: Remove any padding from the ListView.
          padding: EdgeInsets.zero,
          children: <Widget>[
            Container(
              width: 200,
              height: 100,
              child: Padding(
                  padding: const EdgeInsets.all(20),
                  child: DrawerHeader(
                    decoration: BoxDecoration(
                      image: new DecorationImage(
                        alignment: Alignment.center,
                        image: AssetImage("assets/logo.png"),
                        fit: BoxFit.contain,
                      ),
                    ),
                    child: Text(''),
                  )),
            ),
            ListTile(
              minLeadingWidth: 10,
              leading: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Padding(padding: const EdgeInsets.only(left: 30)),
                  Icon(Icons.home, color: Colors.black, size: 18)
                ],
              ),
              title: Text('Home'),
              onTap: () {
                Navigator.pop(context);
                globals.tabController.animateTo(0);
              },
            ),
            ListTile(
              minLeadingWidth: 10,
              leading: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Padding(padding: const EdgeInsets.only(left: 30)),
                  Icon(Icons.article, color: Colors.black, size: 18)
                ],
              ),
              title: Text('News'),
              onTap: () {
                Navigator.pop(context);
                globals.tabController.animateTo(1);
              },
            ),
            ListTile(
              minLeadingWidth: 10,
              leading: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Padding(padding: const EdgeInsets.only(left: 30)),
                  Icon(Icons.account_balance_wallet,
                      color: Colors.black, size: 18)
                ],
              ),
              title: Text('Wallet'),
              onTap: () {
                Navigator.pop(context);
                globals.tabController.animateTo(2);
              },
            ),
            ListTile(
              minLeadingWidth: 10,
              leading: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Padding(padding: const EdgeInsets.only(left: 30)),
                  Icon(Icons.chat, color: Colors.black, size: 18)
                ],
              ),
              title: Text('Support'),
              onTap: () {
                Navigator.pop(context);
                globals.tabController.animateTo(3);
              },
            ),
            ListTile(
              minLeadingWidth: 10,
              leading: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Padding(padding: const EdgeInsets.only(left: 30)),
                  Icon(Icons.book_online, color: Colors.black, size: 18)
                ],
              ),
              title: Text('Reserve Digital Twin'),
              onTap: () {
                Navigator.pop(context);
                globals.tabController.animateTo(4);
              },
            ),
            // ListTile(
            //   minLeadingWidth : 10,
            //   leading: Column(
            //     mainAxisAlignment: MainAxisAlignment.center,
            //     children: <Widget>[
            //       Padding(padding: const EdgeInsets.only(left: 30)),
            //       Icon(Icons.network_check, color: Colors.black, size: 18)
            //     ],
            //   ),
            //   title: Text('Planetary Network'),
            //   onTap: () {
            //     Navigator.pop(context);
            //     globals.tabController.animateTo(5);
            //   },
            // ),
            ListTile(
              minLeadingWidth: 10,
              leading: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: <Widget>[
                  Padding(padding: const EdgeInsets.only(left: 30)),
                  Icon(Icons.settings, color: Colors.black, size: 18)
                ],
              ),
              title: Text('Settings'),
              onTap: () {
                Navigator.pop(context);
                globals.tabController.animateTo(5);
              },
            ),
          ],
        ),
      ),
    );
  }
}
