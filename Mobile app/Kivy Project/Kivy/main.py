from kivy.app import App
from kivy.uix.screenmanager import ScreenManager, Screen
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.gridlayout import GridLayout
from kivy.uix.scrollview import ScrollView
from kivy.uix.button import Button
from kivy.uix.togglebutton import ToggleButton
from kivy.uix.label import Label
from kivy.uix.image import AsyncImage
from kivy.core.window import Window
from kivy.metrics import dp

Window.size = (360, 640)
Window.clearcolor = (0.05, 0.05, 0.05, 1)

movie_db = [
    {"title": "Spider-Man: No Way Home", "poster": "https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1R80vE1IGe1gK.jpg", "genre": "Action / Sci-Fi", "duration": "148 Min", "synopsis": "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero.", "showtimes": ["10:30", "13:45", "17:00", "20:15"]},
    {"title": "Thor: Ragnarok", "poster": "https://image.tmdb.org/t/p/w500/rzRwTcFvttcN1ZpX2xv4j3tAQeC.jpg", "genre": "Action / Fantasy", "duration": "130 Min", "synopsis": "Thor is imprisoned on the planet Sakaar, and must race against time to return to Asgard and stop Ragnarök.", "showtimes": ["11:00", "14:30", "18:00"]},
    {"title": "A Whisker Away", "poster": "https://image.tmdb.org/t/p/w500/51JxFbHnws4h4GkI5QeXq7XyIIN.jpg", "genre": "Anime / Romance", "duration": "104 Min", "synopsis": "Miyo Sasaki is in love with her classmate Kento Hinode and tries repeatedly to get his attention by transforming into a cat.", "showtimes": ["12:00", "15:15", "19:00"]},
    {"title": "The Cat Returns", "poster": "https://image.tmdb.org/t/p/w500/vQt1Yh1A2aXkR7X1oEDkP7o2P70.jpg", "genre": "Anime / Fantasy", "duration": "75 Min", "synopsis": "After helping a cat, a seventeen-year-old girl finds herself involuntarily engaged to a cat Prince in a magical world where her only hope of freedom lies with a dapper cat statuette come to life.", "showtimes": ["10:00", "12:30", "16:00"]},
    {"title": "Your Name.", "poster": "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg", "genre": "Anime / Drama", "duration": "106 Min", "synopsis": "Two teenagers share a profound, magical connection upon discovering they are swapping bodies.", "showtimes": ["11:15", "14:20", "18:45", "21:00"]},
    {"title": "Iron Man", "poster": "https://image.tmdb.org/t/p/w500/78lPtwv72eTNqFW9BocxGWs18P.jpg", "genre": "Action / Sci-Fi", "duration": "126 Min", "synopsis": "After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil.", "showtimes": ["13:00", "16:30", "20:00"]}
]

class MovieHomeScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        main_layout = BoxLayout(orientation='vertical', spacing=10)
        header = Label(text="Demo App", font_size='22sp', size_hint_y=None, height=dp(60), color=(1, 0.8, 0, 1), bold=True)
        main_layout.add_widget(header)
        scroll = ScrollView(size_hint=(1, 1))
        grid = GridLayout(cols=2, spacing=15, padding=15, size_hint_y=None)
        grid.bind(minimum_height=grid.setter('height'))
        for movie in movie_db:
            card = BoxLayout(orientation='vertical', size_hint_y=None, height=dp(280))
            img = AsyncImage(source=movie["poster"], allow_stretch=True, keep_ratio=True, size_hint_y=0.8)
            title_btn = Button(text=movie["title"], size_hint_y=0.2, background_normal='', background_color=(0.1, 0.1, 0.1, 1), color=(1, 1, 1, 1), text_size=(None, None), halign='center', valign='middle')
            title_btn.bind(on_press=lambda instance, m=movie: self.go_to_details(m))
            card.add_widget(img)
            card.add_widget(title_btn)
            grid.add_widget(card)
        scroll.add_widget(grid)
        main_layout.add_widget(scroll)
        self.add_widget(main_layout)

    def go_to_details(self, selected_movie):
        app = App.get_running_app()
        app.booking_data['movie'] = selected_movie
        self.manager.get_screen('details').update_ui()
        self.manager.current = 'details'

class DetailsScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.main_layout = BoxLayout(orientation='vertical')
        self.scroll = ScrollView(size_hint=(1, 0.9))
        self.content = BoxLayout(orientation='vertical', size_hint_y=None, padding=20, spacing=15)
        self.content.bind(minimum_height=self.content.setter('height'))
        self.movie_image = AsyncImage(allow_stretch=True, keep_ratio=True, size_hint_y=None, height=dp(300))
        self.movie_title = Label(font_size='24sp', bold=True, size_hint_y=None, height=dp(40), color=(1, 0.8, 0, 1))
        self.movie_meta = Label(font_size='14sp', size_hint_y=None, height=dp(30), color=(0.7, 0.7, 0.7, 1))
        self.movie_synopsis = Label(font_size='14sp', size_hint_y=None, text_size=(Window.width - 40, None), halign='left')
        self.showtime_label = Label(text="Select Showtime", font_size='18sp', bold=True, size_hint_y=None, height=dp(40))
        self.showtime_grid = GridLayout(cols=3, spacing=10, size_hint_y=None)
        self.content.add_widget(self.movie_image)
        self.content.add_widget(self.movie_title)
        self.content.add_widget(self.movie_meta)
        self.content.add_widget(self.movie_synopsis)
        self.content.add_widget(self.showtime_label)
        self.content.add_widget(self.showtime_grid)
        self.scroll.add_widget(self.content)
        self.bottom_bar = BoxLayout(size_hint_y=0.1, padding=10, spacing=10)
        back_btn = Button(text="< Back", size_hint_x=0.3, background_normal='', background_color=(0.2, 0.2, 0.2, 1))
        back_btn.bind(on_press=self.go_back)
        self.bottom_bar.add_widget(back_btn)
        self.main_layout.add_widget(self.scroll)
        self.main_layout.add_widget(self.bottom_bar)
        self.add_widget(self.main_layout)

    def update_ui(self):
        app = App.get_running_app()
        movie = app.booking_data['movie']
        self.movie_image.source = movie["poster"]
        self.movie_title.text = movie["title"]
        self.movie_meta.text = f"{movie['genre']}  |  {movie['duration']}"
        self.movie_synopsis.text = movie["synopsis"]
        self.movie_synopsis.texture_update()
        self.movie_synopsis.height = self.movie_synopsis.texture_size[1] + dp(20)
        self.showtime_grid.clear_widgets()
        rows = (len(movie["showtimes"]) + 2) // 3
        self.showtime_grid.height = rows * dp(50)
        for time in movie["showtimes"]:
            btn = Button(text=time, size_hint_y=None, height=dp(40), background_normal='', background_color=(0.3, 0.3, 0.3, 1))
            btn.bind(on_press=lambda instance, t=time: self.select_showtime(t))
            self.showtime_grid.add_widget(btn)

    def select_showtime(self, time):
        app = App.get_running_app()
        app.booking_data['time'] = time
        self.manager.get_screen('seats').update_ui()
        self.manager.current = 'seats'

    def go_back(self, instance):
        self.manager.current = 'home'

class SeatSelectionScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.main_layout = BoxLayout(orientation='vertical', padding=10, spacing=10)
        
        self.header_label = Label(font_size='18sp', bold=True, size_hint_y=0.1, color=(1, 0.8, 0, 1))
        self.screen_img = Label(text="----------------- SCREEN -----------------", size_hint_y=0.05, color=(0.5, 0.5, 0.5, 1))
        
        self.seat_grid = GridLayout(cols=5, spacing=10, size_hint_y=0.6)
        self.seats = []
        
        for row in ['A', 'B', 'C', 'D', 'E']:
            for col in range(1, 6):
                seat_id = f"{row}{col}"
                # แก้ไข: เอา background_color_down ออกไป
                btn = ToggleButton(
                    text=seat_id, 
                    background_normal='', 
                    background_down='', 
                    background_color=(0.2, 0.2, 0.2, 1)
                )
                btn.bind(on_state=self.on_seat_toggle)
                self.seat_grid.add_widget(btn)
                self.seats.append(btn)
                
        self.price_label = Label(text="Total: 0 THB", font_size='18sp', size_hint_y=0.1)
        
        self.bottom_bar = BoxLayout(size_hint_y=0.1, spacing=10)
        back_btn = Button(text="< Back", size_hint_x=0.3, background_normal='', background_color=(0.2, 0.2, 0.2, 1))
        back_btn.bind(on_press=self.go_back)
        
        self.confirm_btn = Button(text="Confirm Seats", size_hint_x=0.7, background_normal='', background_color=(0.1, 0.6, 0.1, 1), disabled=True)
        self.confirm_btn.bind(on_press=self.confirm_booking)
        
        self.bottom_bar.add_widget(back_btn)
        self.bottom_bar.add_widget(self.confirm_btn)
        
        self.main_layout.add_widget(self.header_label)
        self.main_layout.add_widget(self.screen_img)
        self.main_layout.add_widget(self.seat_grid)
        self.main_layout.add_widget(self.price_label)
        self.main_layout.add_widget(self.bottom_bar)
        self.add_widget(self.main_layout)

    def update_ui(self):
        app = App.get_running_app()
        movie = app.booking_data['movie']['title']
        time = app.booking_data['time']
        self.header_label.text = f"{movie}\nShowtime: {time}"
        
        for seat in self.seats:
            seat.state = 'normal'
            # รีเซ็ตสีกลับเป็นสีเทาเข้มเมื่อเข้ามาหน้านี้ใหม่
            seat.background_color = (0.2, 0.2, 0.2, 1)
            
        app.booking_data['seats'] = []
        self.price_label.text = "Total: 0 THB"
        self.confirm_btn.disabled = True

    def on_seat_toggle(self, instance, value):
        app = App.get_running_app()
        
        if value == 'down':
            # เพิ่มคำสั่งเปลี่ยนสีปุ่มเป็นสีแดงเมื่อถูกเลือก
            instance.background_color = (0.8, 0.1, 0.1, 1)
            app.booking_data['seats'].append(instance.text)
        else:
            # เพิ่มคำสั่งเปลี่ยนสีปุ่มกลับเป็นสีเทาเมื่อยกเลิกการเลือก
            instance.background_color = (0.2, 0.2, 0.2, 1)
            if instance.text in app.booking_data['seats']:
                app.booking_data['seats'].remove(instance.text)
                
        total = len(app.booking_data['seats']) * 250
        self.price_label.text = f"Total: {total} THB"
        self.confirm_btn.disabled = len(app.booking_data['seats']) == 0

    def confirm_booking(self, instance):
        self.manager.get_screen('ticket').update_ui()
        self.manager.current = 'ticket'

    def go_back(self, instance):
        self.manager.current = 'details'

class TicketScreen(Screen):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.main_layout = BoxLayout(orientation='vertical', padding=20, spacing=20)
        self.title_label = Label(text="E-TICKET", font_size='28sp', bold=True, size_hint_y=0.1, color=(1, 0.8, 0, 1))
        self.ticket_card = BoxLayout(orientation='vertical', padding=20, spacing=10)
        self.ticket_info = Label(text="", font_size='18sp', halign='center', valign='middle')
        self.ticket_card.add_widget(self.ticket_info)
        home_btn = Button(text="Back to Home", size_hint_y=0.1, background_normal='', background_color=(0.8, 0.1, 0.1, 1))
        home_btn.bind(on_press=self.go_home)
        self.main_layout.add_widget(self.title_label)
        self.main_layout.add_widget(self.ticket_card)
        self.main_layout.add_widget(home_btn)
        self.add_widget(self.main_layout)

    def update_ui(self):
        app = App.get_running_app()
        data = app.booking_data
        seats_str = ", ".join(data['seats'])
        total_price = len(data['seats']) * 250
        self.ticket_info.text = f"Movie: {data['movie']['title']}\n\nShowtime: {data['time']}\n\nSeats: {seats_str}\n\nTotal Paid: {total_price} THB"

    def go_home(self, instance):
        app = App.get_running_app()
        app.booking_data = {'movie': None, 'time': None, 'seats': []}
        self.manager.current = 'home'

class MajorCloneApp(App):
    booking_data = {'movie': None, 'time': None, 'seats': []}
    
    def build(self):
        sm = ScreenManager()
        sm.add_widget(MovieHomeScreen(name='home'))
        sm.add_widget(DetailsScreen(name='details'))
        sm.add_widget(SeatSelectionScreen(name='seats'))
        sm.add_widget(TicketScreen(name='ticket'))
        return sm

if __name__ == '__main__':
    MajorCloneApp().run()