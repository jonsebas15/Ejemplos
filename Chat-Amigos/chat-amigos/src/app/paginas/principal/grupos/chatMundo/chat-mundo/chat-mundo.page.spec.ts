import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatMundoPage } from './chat-mundo.page';

describe('ChatMundoPage', () => {
  let component: ChatMundoPage;
  let fixture: ComponentFixture<ChatMundoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatMundoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
